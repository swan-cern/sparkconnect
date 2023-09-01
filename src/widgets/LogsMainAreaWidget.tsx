/**
 * LogsMainAreaWidget
 * The main area widget for displaying the Spark connection logs.
 */
import React from 'react';
import { VDomRenderer } from '@jupyterlab/apputils';
import { JupyterFrontEnd } from '@jupyterlab/application';
import { JupyterLabAppContext } from '../const';
import { SWRConfig } from 'swr';
import { requestAPI } from '../handler';
import LogsWidget from '../components/widgets/LogsWidget';
import { Message } from '@lumino/messaging';

export interface SidebarPanelOptions {
  app: JupyterFrontEnd;
}

const WIDGET_CLASS = 'jp-SparkConnectExtensionLogsWidget';

export class LogsMainAreaWidget extends VDomRenderer {
  app: JupyterFrontEnd;
  shown: boolean = false;

  constructor(options: SidebarPanelOptions) {
    super();
    super.addClass(WIDGET_CLASS);

    const { app } = options;
    this.app = app;
  }

  protected onAfterShow(msg: Message): void {
    this.shown = true;
  }

  protected onAfterHide(msg: Message): void {
    this.shown = false;
  }

  render(): React.ReactElement {
    const swrOptions = {
      fetcher: (url: string, init: RequestInit) => requestAPI<any>(url, init)
    };

    return (
      <JupyterLabAppContext.Provider value={this.app}>
        <SWRConfig value={swrOptions}>{this.shown && <LogsWidget />}</SWRConfig>
      </JupyterLabAppContext.Provider>
    );
  }
}

export default LogsMainAreaWidget;
