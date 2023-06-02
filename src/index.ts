import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { ISettingRegistry } from '@jupyterlab/settingregistry';

import { requestAPI } from './handler';

/**
 * Initialization data for the spark-connect-labextension extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'spark-connect-labextension:plugin',
  description: 'A JupyterLab Extension to connect to Apache Spark using Spark Connect',
  autoStart: true,
  optional: [ISettingRegistry],
  activate: (app: JupyterFrontEnd, settingRegistry: ISettingRegistry | null) => {
    console.log('JupyterLab extension spark-connect-labextension is activated!');

    if (settingRegistry) {
      settingRegistry
        .load(plugin.id)
        .then(settings => {
          console.log('spark-connect-labextension settings loaded:', settings.composite);
        })
        .catch(reason => {
          console.error('Failed to load settings for spark-connect-labextension.', reason);
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

export default plugin;
