import React from 'react';
import SparkLogo from '../SparkLogo';
import { Section } from '../Section';
import { requestAPI } from '../../handler';
import useStatus from '../../hooks/useStatus';
import useCluster from '../../hooks/useCluster';
import useJupyterLabApp from '../../hooks/useJupyterLabApp';
import CodePreview from '../ready/CodePreview';

const Ready: React.FC = () => {
  const { mutate } = useStatus();
  const disconnect = () => {
    requestAPI<any>('/cluster/stop', { method: 'POST' }).then(mutate);
  };

  const cluster = useCluster();

  const app = useJupyterLabApp();

  const viewWebUI = () => {
    app?.commands.execute('sparkconnect:viewWebUI');
  };

  const viewLogs = () => {
    app?.commands.execute('sparkconnect:viewLogs');
  };

  return (
    <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
      <div style={{ padding: 8 }}>
        <SparkLogo />
        <div style={{ marginTop: 16, color: 'var(--md-green-600)' }}>
          <h3 className="jp-SparkConnectExtension-heading">
            <div>
              <span className="material-symbols-outlined" style={{ fontSize: 36 }}>
                cloud_done
              </span>
            </div>
            Connected to <b>{cluster?.displayName}</b>
          </h3>
        </div>
      </div>
      <Section title="Code" style={{ padding: 8 }} headingStyle={{ marginTop: 16 }}>
        <p style={{ marginTop: 4, fontSize: 'var(--jp-ui-font-size1)' }}>Use this code to start using:</p>
        <CodePreview />
      </Section>
      <Section title="Menu" headingStyle={{ marginTop: 16 }}>
        <div className="jp-SparkConnectExtension-menu-list">
          <div onClick={viewWebUI}>
            <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'var(--jp-ui-font-color2)' }}>
              monitoring
            </span>
            <div>View Spark WebUI</div>
          </div>
          <div onClick={viewLogs}>
            <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'var(--jp-ui-font-color2)' }}>
              monitor_heart
            </span>
            <div>View logs</div>
          </div>
        </div>
      </Section>
      <div style={{ flex: 1 }} />
      <div style={{ padding: 8 }}>
        <button className="jp-Button jp-mod-styled jp-mod-warn" onClick={disconnect} style={{ width: '100%' }}>
          Disconnect
        </button>
      </div>
    </div>
  );
};

export default Ready;
