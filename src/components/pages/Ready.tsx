import React from 'react';
import SparkLogo from '../SparkLogo';
import { Section } from '../Section';
import { requestAPI } from '../../handler';
import useStatus from '../../hooks/useStatus';
import useCluster from '../../hooks/useCluster';

const Ready: React.FC = () => {
  const { mutate } = useStatus();
  const disconnect = () => {
    requestAPI<any>('/cluster/stop', { method: 'POST' }).then(mutate);
  };

  const cluster = useCluster();

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
        <code>Code</code>
      </Section>
      <Section title="Logs" style={{ padding: 8 }} headingStyle={{ marginTop: 16 }}>
        <button className="jp-Button jp-mod-styled jp-mod-accept" style={{ width: '100%' }}>
          View logs
        </button>
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
