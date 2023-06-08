import React from 'react';
import { VDomRenderer } from '@jupyterlab/apputils';
import { JupyterFrontEnd } from '@jupyterlab/application';
import { JupyterLabAppContext } from '../const';

const Panel: React.FC = () => {
  return <div style={{ padding: 8 }}>Hello</div>;
};

const ErrorPanel: React.FC<{ error: string }> = ({ error }) => {
  return <div style={{ padding: 8 }}>{error}</div>;
};

export interface SidebarPanelOptions {
  app: JupyterFrontEnd;
}

const PANEL_CLASS = 'jp-RucioExtensionPanel';

export class SidebarPanel extends VDomRenderer {
  error?: string;
  app: JupyterFrontEnd;

  constructor(options: SidebarPanelOptions, error?: string) {
    super();
    super.addClass(PANEL_CLASS);
    super.title.closable = true;
    // super.title.icon = rucioIcon;

    const { app } = options;
    this.app = app;

    if (error) {
      this.error =
        error ??
        'Failed to activate extension. Make sure that the extension is configured and installed properly.';
      return;
    }
  }

  render(): React.ReactElement {
    if (this.error) {
      return <ErrorPanel error={this.error} />;
    }

    return (
      <JupyterLabAppContext.Provider value={this.app}>
        <Panel />
      </JupyterLabAppContext.Provider>
    );
  }
}

export default SidebarPanel;
