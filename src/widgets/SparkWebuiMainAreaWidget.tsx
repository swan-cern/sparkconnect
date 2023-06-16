import React from 'react';
import { VDomRenderer } from '@jupyterlab/apputils';
import { JupyterFrontEnd } from '@jupyterlab/application';
import { launchIcon } from '@jupyterlab/ui-components';
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

export class SparkWebuiToolbarWidget extends VDomRenderer {
  app: JupyterFrontEnd;

  constructor(options: SparkWebuiWidgetOptions) {
    super();
    const { app } = options;
    this.app = app;
  }

  render(): React.ReactElement {
    return (
      <div style={{ display: 'flex', flexDirection: 'row', gap: 4 }}>
        <button className="jp-ToolbarButtonComponent jp-mod-minimal jp-Button" onClick={() => window.open(`/${EXTENSION_ID}/ui`, '_blank')}>
          <launchIcon.react tag="span" width={16} height={16} marginTop={4} />
          &nbsp;<span className="jp-ToolbarButtonComponent-label">Open in New Tab</span>
        </button>
      </div>
    );
  }
}

export default SparkWebuiMainAreaWidget;
