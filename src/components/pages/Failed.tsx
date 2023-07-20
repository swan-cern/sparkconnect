import React from 'react';
import useSWR from 'swr';
import SparkLogo from '../SparkLogo';
import useCluster from '../../hooks/useCluster';
import useJupyterLabApp from '../../hooks/useJupyterLabApp';
import { UIStore } from '../../store/UIStore';
import { Section } from '../Section';
import SuggestionItem from '../failed/SuggestionItem';
import { SparkClusterErrorSuggestion } from '../../types';

const Failed: React.FC = () => {
  const cluster = useCluster();

  const { data: errorSuggestions } = useSWR<SparkClusterErrorSuggestion[]>('/cluster/errors');

  const app = useJupyterLabApp();
  const viewLogs = () => {
    app?.commands.execute('sparkconnect:viewLogs');
  };

  const retry = () => {
    UIStore.update(s => {
      s.isConnectionFailed = false;
    });
  };

  return (
    <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
      <div style={{ padding: 8 }}>
        <SparkLogo />
        <div style={{ marginTop: 16, color: 'var(--md-red-600)' }}>
          <h3 className="jp-SparkConnectExtension-heading">
            <div>
              <span className="material-symbols-outlined" style={{ fontSize: 36 }}>
                signal_disconnected
              </span>
            </div>
            Error connecting to <b>{cluster?.displayName}</b>
          </h3>
        </div>
      </div>
      <Section title="Troubleshoot" headingStyle={{ marginTop: 16 }}>
        <div className="jp-SparkConnectExtension-menu-list">
          <div onClick={viewLogs}>
            <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'var(--jp-ui-font-color2)' }}>
              monitor_heart
            </span>
            <div>View connection logs</div>
          </div>
        </div>
      </Section>
      {errorSuggestions?.length !== 0 && (
        <Section title="Suggestions" headingStyle={{ marginTop: 16 }}>
          <div style={{ padding: 8, display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: 8 }}>
            {errorSuggestions?.map(suggestion => (
              <SuggestionItem type={suggestion.type} text={suggestion.message} />
            ))}
          </div>
        </Section>
      )}
      <div style={{ flex: 1 }} />
      <div style={{ padding: 8 }}>
        <button className="jp-Button jp-mod-styled jp-mod-accept" style={{ width: '100%' }} onClick={retry}>
          Retry
        </button>
      </div>
    </div>
  );
};

export default Failed;
