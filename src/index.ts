import { ILabShell, JupyterFrontEnd, JupyterFrontEndPlugin } from '@jupyterlab/application';
import { ISettingRegistry } from '@jupyterlab/settingregistry';
import { MainAreaWidget, ICommandPalette } from '@jupyterlab/apputils';
import { requestAPI } from './handler';
import SidebarPanel from './widgets/SidebarPanel';
import { SparkCluster, SparkConfigBundle, SparkConfigOption } from './types';
import { UIStore } from './store/UIStore';
import LogsMainAreaWidget from './widgets/LogsMainAreaWidget';
import SparkIcon from './icons/SparkIcon';
import SparkWebuiMainAreaWidget, { SparkWebuiToolbarWidget } from './widgets/SparkWebuiMainAreaWidget';
import { EXTENSION_ID } from './const';

/**
 * Initialization data for the spark-connect-labextension extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: EXTENSION_ID + ':plugin',
  description: 'A JupyterLab Extension to connect to Apache Spark using Spark Connect',
  autoStart: true,
  optional: [ISettingRegistry, ICommandPalette],
  requires: [ILabShell],
  activate: (app: JupyterFrontEnd, labShell: ILabShell, settingRegistry: ISettingRegistry | null, commandPalette: ICommandPalette) => {
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
          addLogsMainAreaWidget(app, commandPalette);
          addSparkWebuiMainAreaWidget(app, commandPalette);
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

function addLogsMainAreaWidget(app: JupyterFrontEnd, palette: ICommandPalette) {
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

  palette.addItem({ command, category: 'View Spark Logs' });
}

function addSparkWebuiMainAreaWidget(app: JupyterFrontEnd, palette: ICommandPalette) {
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

  palette.addItem({ command, category: 'View Spark WebUI' });
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
