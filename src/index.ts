import { ILabShell, JupyterFrontEnd, JupyterFrontEndPlugin } from '@jupyterlab/application';
import { ISettingRegistry } from '@jupyterlab/settingregistry';
import { INotebookTracker, NotebookPanel } from '@jupyterlab/notebook';
import { MainAreaWidget, ISessionContext } from '@jupyterlab/apputils';
import { requestAPI } from './handler';
import SidebarPanel from './widgets/SidebarPanel';
import { SparkCluster, SparkClusterStatus, SparkConfigBundle, SparkConfigOption } from './types';
import { UIStore } from './store/UIStore';
import LogsMainAreaWidget from './widgets/LogsMainAreaWidget';
import SparkIcon from './icons/SparkIcon';
import SparkWebuiMainAreaWidget, { SparkWebuiToolbarWidget } from './widgets/SparkWebuiMainAreaWidget';
import { EXTENSION_ID, FRONTEND_COMM_ID } from './const';
import { ICommMsgMsg } from '@jupyterlab/services/lib/kernel/messages';

/**
 * Initialization data for the spark-connect-labextension extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: EXTENSION_ID + ':plugin',
  description: 'A JupyterLab Extension to connect to Apache Spark using Spark Connect',
  autoStart: true,
  optional: [ISettingRegistry],
  requires: [ILabShell, INotebookTracker],
  activate: (app: JupyterFrontEnd, labShell: ILabShell, notebookTracker: INotebookTracker, settingRegistry: ISettingRegistry | null) => {
    console.log('JupyterLab extension spark-connect-labextension is activated!');

    if (settingRegistry) {
      settingRegistry
        .load(plugin.id)
        .then(settings => {
          console.log('spark-connect-labextension settings loaded:', settings.composite);
        })
        .then(loadExtensionState)
        .then(() => {
          activateSidebarPanel(app, labShell);
          addLogsMainAreaWidget(app);
          addSparkWebuiMainAreaWidget(app);
          addNotebookListener(labShell, notebookTracker);
        })
        .catch(reason => {
          console.error('Failed to load settings for spark-connect-labextension.', reason);
        });
    }
  }
};

function activateSidebarPanel(app: JupyterFrontEnd, labShell: ILabShell) {
  const sidebarPanel = new SidebarPanel({ app });
  sidebarPanel.id = EXTENSION_ID + ':panel';
  labShell.add(sidebarPanel, 'right', { rank: 900 });
  labShell.activateById(sidebarPanel.id);
}

function addLogsMainAreaWidget(app: JupyterFrontEnd) {
  // Define a widget creator function,
  // then call it to make a new widget
  const newWidget = () => {
    // Create a blank content widget inside of a MainAreaWidget
    const content = new LogsMainAreaWidget({ app });
    const widget = new MainAreaWidget({ content });
    widget.id = 'sparkconnect-logs';
    widget.title.label = 'Spark Logs';
    widget.title.closable = true;
    widget.title.icon = SparkIcon;
    return widget;
  };

  let widget = newWidget();

  const command: string = 'sparkconnect:viewLogs';
  app.commands.addCommand(command, {
    label: 'View Spark Logs',
    execute: () => {
      if (widget.isDisposed) {
        widget = newWidget();
      }
      if (!widget.isAttached) {
        app.shell.add(widget, 'main');
      }

      app.shell.activateById(widget.id);
    }
  });
}

function addSparkWebuiMainAreaWidget(app: JupyterFrontEnd) {
  const newWidget = () => {
    const content = new SparkWebuiMainAreaWidget({ app });
    const widget = new MainAreaWidget({ content });
    widget.id = 'sparkconnect-webui';
    widget.title.label = 'Spark WebUI';
    widget.title.closable = true;
    widget.title.icon = SparkIcon;

    widget.toolbar.addItem('spark-webui-toolbar', new SparkWebuiToolbarWidget({ app }));
    return widget;
  };

  let widget = newWidget();

  const command: string = 'sparkconnect:viewWebUI';
  app.commands.addCommand(command, {
    label: 'View Spark WebUI',
    execute: () => {
      if (widget.isDisposed) {
        widget = newWidget();
      }
      if (!widget.isAttached) {
        app.shell.add(widget, 'main');
      }

      app.shell.activateById(widget.id);
    }
  });
}

function addNotebookListener(labShell: ILabShell, notebookTracker: INotebookTracker) {
  const currentTabChanged = () => {
    const isTabNotebook = labShell.currentWidget === notebookTracker.currentWidget;
    const activeNotebook = isTabNotebook ? notebookTracker.currentWidget : null;
    UIStore.update(s => {
      s.activeNotebookPanel = activeNotebook as any;
    });
  };

  const onNotebookAdded = (sender: INotebookTracker, panel: NotebookPanel) => {
    panel.sessionContext.kernelChanged.connect((sender: ISessionContext, changed) => {
      const newKernel = changed.newValue;
      if (newKernel) {
        panel.sessionContext.ready.then(() => {
          newKernel.removeCommTarget(FRONTEND_COMM_ID, (comm, msg) => {});
          newKernel.registerCommTarget(FRONTEND_COMM_ID, (comm, openMsg) => {
            comm.onMsg = msg => handleKernelMessage(msg, panel);
          });
        });
      }
    });
  };

  const handleKernelMessage = (msg: ICommMsgMsg, panel: NotebookPanel) => {
    const { data } = msg.content;
    const { action } = data;
    if (action === 'attach-config-to-notebook') {
      attachConfigToNotebook(panel);
    }
  };

  labShell.currentChanged.connect(currentTabChanged);
  notebookTracker.widgetAdded.connect(onNotebookAdded);
}

function attachConfigToNotebook(notebook: NotebookPanel) {
  requestAPI<SparkClusterStatus>('/cluster/status')
    .then(status => {
      if (status.status !== 'READY') {
        return;
      }

      const configMetadata = {
        cluster_name: status.clusterName,
        bundled_options: status.configBundles,
        list_of_options: Object.keys(status.extraConfig).map(k => ({
          name: k,
          value: status.extraConfig[k]
        }))
      };
      notebook.model?.setMetadata('sparkconnect', configMetadata);
    })
    .catch(e => {
      console.error('Failed attaching config to notebook', e);
    });
}

async function loadExtensionState() {
  const clusters = await requestAPI<SparkCluster[]>('/clusters');
  const configBundles = await requestAPI<SparkConfigBundle[]>('/config-bundles');
  const configOptions = await requestAPI<SparkConfigOption[]>('/config-options');
  UIStore.update(s => {
    s.clusters = clusters;
    s.configBundleOptions = configBundles;
    s.configOptions = configOptions;
  });
}

export default plugin;
