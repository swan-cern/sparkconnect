import React, { useEffect, useMemo, useState } from 'react';
import SparkLogo from '../SparkLogo';
import { Section } from '../Section';
import { requestAPI } from '../../handler';
import useStatus from '../../hooks/useStatus';
import useCluster from '../../hooks/useCluster';
import useJupyterLabApp from '../../hooks/useJupyterLabApp';
import CodePreview from '../ready/CodePreview';
import { UIStore } from '../../store/UIStore';
import SuggestionItem from '../failed/SuggestionItem';

const Ready: React.FC = () => {
  const { data, mutate } = useStatus();
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

  const activeNotebookPanel = UIStore.useState(s => s.activeNotebookPanel);
  const [notebookMetadata, setNotebookMetadata] = useState<any>();

  useEffect(() => {
    const model = activeNotebookPanel?.model;
    const sparkMetadata = model?.metadata.sparkconnect;
    setNotebookMetadata(sparkMetadata);

    const onMetadataChanged = () => {
      setNotebookMetadata(model?.metadata.sparkconnect);
    };
    model?.metadataChanged.connect(onMetadataChanged);

    return () => {
      model?.metadataChanged.disconnect(onMetadataChanged);
    };
  }, [activeNotebookPanel]);

  const attachConfigToNotebook = () => {
    if (!data) return;

    const configMetadata = {
      cluster_name: data.clusterName,
      bundled_options: data.configBundles,
      list_of_options: Object.keys(data.extraConfig).map(k => ({
        name: k,
        value: data.extraConfig[k]
      }))
    };

    activeNotebookPanel?.model?.setMetadata('sparkconnect', configMetadata);
  };

  const detachNotebookConfig = () => {
    activeNotebookPanel?.model?.deleteMetadata('sparkconnect');
  };

  const notebookConfigDiffers = useMemo(() => {
    if (!notebookMetadata || !data) return false;

    const clusterMatches = notebookMetadata.cluster_name === data.clusterName;
    const configBundlesMatches = notebookMetadata.bundled_options.length === data.configBundles.length && notebookMetadata.bundled_options.every((bundle: string) => data.configBundles.includes(bundle));
    const extraConfigMatches = notebookMetadata.list_of_options.length === Object.keys(data.extraConfig).length && notebookMetadata.list_of_options.every((opt: any) => data.extraConfig[opt.name] === opt.value);

    if (!!notebookMetadata.cluster_name && !clusterMatches) {
      return true;
    }

    if (!!notebookMetadata.bundled_options && !configBundlesMatches) {
      return true;
    }

    if (!!notebookMetadata.list_of_options && !extraConfigMatches) {
      return true;
    }

    return false;
  }, [notebookMetadata, data]);

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
      {notebookConfigDiffers && (
        <div style={{ padding: 8 }}>
          <SuggestionItem type="warn" text="Notebook uses a different configuration." />
        </div>
      )}
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
          {notebookConfigDiffers && (
            <div onClick={attachConfigToNotebook}>
              <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'var(--jp-ui-font-color2)' }}>
                attach_file_add
              </span>
              <div>Override notebook config</div>
            </div>
          )}
          {!notebookMetadata && !!activeNotebookPanel && (
            <div onClick={attachConfigToNotebook}>
              <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'var(--jp-ui-font-color2)' }}>
                attach_file_add
              </span>
              <div>Attach config to notebook</div>
            </div>
          )}
          {!!notebookMetadata && (
            <div onClick={detachNotebookConfig} style={{ color: 'var(--jp-error-color1)' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'var(--jp-error-color1)' }}>
                link_off
              </span>
              <div>Detach config from notebook</div>
            </div>
          )}
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
