import React from 'react';
import { VDomRenderer } from '@jupyterlab/apputils';
import { JupyterFrontEnd } from '@jupyterlab/application';
import { JupyterLabAppContext } from '../const';
import SparkIcon from '../icons/SparkIcon';
import Panel from '../components/Panel';
import { SWRConfig } from 'swr';
import { requestAPI } from '../handler';
export interface SidebarPanelOptions {
  app: JupyterFrontEnd;
}

const PANEL_CLASS = 'jp-SparkConnectExtensionPanel';

export class SidebarPanel extends VDomRenderer {
  error?: string;
  app: JupyterFrontEnd;

  constructor(options: SidebarPanelOptions, error?: string) {
    super();
    super.addClass(PANEL_CLASS);
    super.title.closable = true;
    super.title.icon = SparkIcon;

    const { app } = options;
    this.app = app;

    if (error) {
      this.error = error ?? 'Failed to activate extension. Make sure that the extension is configured and installed properly.';
      return;
    }
  }

  render(): React.ReactElement {
    if (this.error) {
      return <div style={{ padding: 12 }}>{this.error}</div>;
    }

    const swrOptions = {
      fetcher: (url: string, init: RequestInit) => requestAPI<any>(url, init)
    };

    return (
      <JupyterLabAppContext.Provider value={this.app}>
        <SWRConfig value={swrOptions}>
          <Panel />
        </SWRConfig>
      </JupyterLabAppContext.Provider>
    );
  }
}

export default SidebarPanel;
