import {
  ILabShell,
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { ISettingRegistry } from '@jupyterlab/settingregistry';

import { requestAPI } from './handler';
import SidebarPanel from './widgets/SidebarPanel';

const EXTENSION_ID = 'spark-connect-labextension';

/**
 * Initialization data for the spark-connect-labextension extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: EXTENSION_ID + ':plugin',
  description:
    'A JupyterLab Extension to connect to Apache Spark using Spark Connect',
  autoStart: true,
  optional: [ISettingRegistry],
  requires: [ILabShell],
  activate: (
    app: JupyterFrontEnd,
    labShell: ILabShell,
    settingRegistry: ISettingRegistry | null
  ) => {
    console.log(
      'JupyterLab extension spark-connect-labextension is activated!'
    );

    if (settingRegistry) {
      settingRegistry
        .load(plugin.id)
        .then(settings => {
          console.log(
            'spark-connect-labextension settings loaded:',
            settings.composite
          );
          activateSidebarPanel(app, labShell);
        })
        .catch(reason => {
          console.error(
            'Failed to load settings for spark-connect-labextension.',
            reason
          );
        });
    }

    requestAPI<any>('get-example')
      .then(data => {
        console.log(data);
      })
      .catch(reason => {
        console.error(
          `The spark_connect_labextension server extension appears to be missing.\n${reason}`
        );
      });
  }
};

function activateSidebarPanel(app: JupyterFrontEnd, labShell: ILabShell) {
  const sidebarPanel = new SidebarPanel({ app });
  sidebarPanel.id = EXTENSION_ID + ':panel';
  labShell.add(sidebarPanel, 'right', { rank: 900 });
  labShell.activateById(sidebarPanel.id);
}

export default plugin;
