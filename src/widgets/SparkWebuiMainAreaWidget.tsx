import React from 'react';
import { VDomRenderer } from '@jupyterlab/apputils';
import { JupyterFrontEnd } from '@jupyterlab/application';
import { EXTENSION_ID, JupyterLabAppContext } from '../const';

export interface SparkWebuiWidgetOptions {
  app: JupyterFrontEnd;
}

const WIDGET_CLASS = 'jp-SparkConnectExtensionSparkWebuiWidget';

export class SparkWebuiMainAreaWidget extends VDomRenderer {
  app: JupyterFrontEnd;

  constructor(options: SparkWebuiWidgetOptions) {
    super();
    super.addClass(WIDGET_CLASS);

    const { app } = options;
    this.app = app;
  }

  render(): React.ReactElement {
    return (
      <JupyterLabAppContext.Provider value={this.app}>
        <iframe src={`/${EXTENSION_ID}/ui/`} width="100%" height="100%" style={{ border: 0 }} />
      </JupyterLabAppContext.Provider>
    );
  }
}

export default SparkWebuiMainAreaWidget;
