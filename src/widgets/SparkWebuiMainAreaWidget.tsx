/**
 * SparkWebuiMainAreaWidget
 * Lumino Renderer for rendering the Spark Web UI iframe.
 */
import React from 'react';
import { VDomRenderer } from '@jupyterlab/apputils';
import { JupyterFrontEnd } from '@jupyterlab/application';
import { launchIcon } from '@jupyterlab/ui-components';
import { EXTENSION_ID, JupyterLabAppContext } from '../const';
import { ServerConnection } from '@jupyterlab/services';
import { URLExt } from '@jupyterlab/coreutils';
import '../../style/SparkWebuiMainAreaWidget.css';

export interface SparkWebuiWidgetOptions {
  app: JupyterFrontEnd;
}

const WIDGET_CLASS = 'jp-SparkConnectExtensionSparkWebuiWidget';

export class SparkWebuiMainAreaWidget extends VDomRenderer {
  app: JupyterFrontEnd;
  requestUrl: string;

  constructor(options: SparkWebuiWidgetOptions) {
    super();
    super.addClass(WIDGET_CLASS);

    const { app } = options;
    this.app = app;

    const settings = ServerConnection.makeSettings();
    this.requestUrl = URLExt.join(
      settings.baseUrl,
      'api',
      EXTENSION_ID, // API Namespace
      'ui/'
    );
  }

  render(): React.ReactElement {
    return (
      <JupyterLabAppContext.Provider value={this.app}>
        <iframe src={this.requestUrl} width="100%" height="100%" style={{ border: 0 }} />
      </JupyterLabAppContext.Provider>
    );
  }
}

export class SparkWebuiToolbarWidget extends VDomRenderer {
  app: JupyterFrontEnd;
  requestUrl: string;

  constructor(options: SparkWebuiWidgetOptions) {
    super();
    const { app } = options;
    this.app = app;

    const settings = ServerConnection.makeSettings();
    this.requestUrl = URLExt.join(
      settings.baseUrl,
      'api',
      EXTENSION_ID, // API Namespace
      'ui/'
    );
  }

  render(): React.ReactElement {
    return (
      <div className="jp-SparkConnectExtension-SparkWebuiMainAreaWidget-root">
        <button className="jp-ToolbarButtonComponent jp-mod-minimal jp-Button" onClick={() => window.open(this.requestUrl, '_blank')}>
          <launchIcon.react tag="span" width={16} height={16} marginTop={4} />
          &nbsp;<span className="jp-ToolbarButtonComponent-label">Open in New Tab</span>
        </button>
      </div>
    );
  }
}

export default SparkWebuiMainAreaWidget;
