import React from 'react';
import { VDomRenderer } from '@jupyterlab/apputils';
import { JupyterFrontEnd } from '@jupyterlab/application';
import { JupyterLabAppContext } from '../const';
import { SWRConfig } from 'swr';
import { requestAPI } from '../handler';
import LogsWidget from '../components/widgets/LogsWidget';

export interface SidebarPanelOptions {
  app: JupyterFrontEnd;
}

const WIDGET_CLASS = 'jp-SparkConnectExtensionLogsWidget';

export class LogsMainAreaWidget extends VDomRenderer {
  app: JupyterFrontEnd;

  constructor(options: SidebarPanelOptions) {
    super();
    super.addClass(WIDGET_CLASS);

    const { app } = options;
    this.app = app;
  }

  render(): React.ReactElement {
    const swrOptions = {
      fetcher: (url: string, init: RequestInit) => requestAPI<any>(url, init)
    };

    return (
      <JupyterLabAppContext.Provider value={this.app}>
        <SWRConfig value={swrOptions}>
          <LogsWidget />
        </SWRConfig>
      </JupyterLabAppContext.Provider>
    );
  }
}

export default LogsMainAreaWidget;
