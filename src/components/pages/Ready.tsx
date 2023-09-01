/**
 * Ready
 * This file contains the UI of the "connected" page.
 */
import React, { useEffect, useMemo, useState } from 'react';
import { showDialog } from '@jupyterlab/apputils';
import SparkLogo from '../SparkLogo';
import { Section } from '../Section';
import { requestAPI } from '../../handler';
import useStatus from '../../hooks/useStatus';
import useCluster from '../../hooks/useCluster';
import useJupyterLabApp from '../../hooks/useJupyterLabApp';
import CodePreview from '../ready/CodePreview';
import { UIStore } from '../../store/UIStore';
import ConfigDiff from '../ready/ConfigDiff';

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

  const viewSparkOptions = () => {
    const sparkOptions = data?.sparkOptions ?? {};
    showDialog({
      title: 'Spark options',
      buttons: [
        {
          label: 'Close',
          caption: 'Close dialog',
          className: '',
          accept: false,
          displayType: 'default',
          ariaLabel: '',
          iconClass: '',
          iconLabel: '',
          actions: []
        }
      ],
      body: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: 400 }}>
          {Object.keys(sparkOptions).length === 0 && <div>No configured options</div>}
          {Object.keys(sparkOptions).map(option => (
            <div>
              <div>{option}</div>
              <small style={{ color: 'var(--jp-ui-font-color2)' }}>{sparkOptions[option]}</small>
            </div>
          ))}
        </div>
      )
    });
  };

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

  const overrideNotebookConfig = () => {
    showDialog({
      title: 'Overwrite attached configuration?',
      body: 'This will overwrite currently attached configuration.'
    }).then(res => {
      if (res.button.accept) {
        attachConfigToNotebook();
      }
    });
  };

  const learnMoreDifferentConfig = () => {
    if (!data) return;

    const currentMetadata = {
      cluster_name: data.clusterName,
      bundled_options: data.configBundles,
      list_of_options: Object.keys(data.extraConfig).map(k => ({
        name: k,
        value: data.extraConfig[k]
      }))
    };

    showDialog({
      title: 'Differring Spark configuration',
      body: <ConfigDiff currentConfig={currentMetadata} notebookConfig={notebookMetadata} />,
      buttons: [
        {
          label: 'Overwrite config',
          caption: 'Overwrite notebook config',
          className: '',
          accept: false,
          displayType: 'warn',
          ariaLabel: '',
          iconClass: '',
          iconLabel: '',
          actions: ['overwrite']
        },
        {
          label: 'Disconnect',
          caption: 'Disconnect',
          className: '',
          accept: false,
          displayType: 'warn',
          ariaLabel: '',
          iconClass: '',
          iconLabel: '',
          actions: ['restart']
        },
        {
          label: 'Dismiss',
          caption: 'Dismiss',
          className: '',
          accept: false,
          displayType: 'default',
          ariaLabel: '',
          iconClass: '',
          iconLabel: '',
          actions: []
        }
      ]
    }).then(res => {
      if (res.button.actions.includes('overwrite')) {
        overrideNotebookConfig();
      } else if (res.button.actions.includes('restart')) {
        disconnect();
      }
    });
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
          <h3 className="jp-SparkConnectExtension-heading" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div>
              <span className="material-symbols-outlined" style={{ fontSize: 36 }}>
                cloud_done
              </span>
            </div>
            <div style={{ textAlign: 'center' }}>
              Connected to <b>{cluster?.displayName}</b>
            </div>
          </h3>
        </div>
      </div>
      {notebookConfigDiffers && (
        <div style={{ padding: 8 }}>
          <div style={{ padding: 8, borderRadius: 'var(--jp-border-radius)', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 8, color: 'var(--jp-ui-inverse-font-color0)', backgroundColor: 'var(--jp-warn-color1)' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
              error
            </span>
            <div>
              Different Spark configuration is attached to this notebook.{' '}
              <a className="jp-SparkConnectExtension-warning-learn-more" onClick={learnMoreDifferentConfig}>
                Learn more
              </a>
            </div>
          </div>
        </div>
      )}
      <Section title="Code" style={{ padding: 8 }} headingStyle={{ marginTop: 16 }}>
        <p style={{ marginTop: 4, fontSize: 'var(--jp-ui-font-size1)' }}>Simply copy and paste the code into a new cell and run it to create your Spark Connect session:</p>
        <CodePreview />
      </Section>
      <Section title="Menu" headingStyle={{ marginTop: 16 }}>
        <div className="jp-SparkConnectExtension-menu-list">
          <div onClick={viewWebUI}>
            <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'var(--jp-ui-font-color2)' }}>
              monitoring
            </span>
            <div>View Spark Web UI</div>
          </div>
          <div onClick={viewLogs}>
            <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'var(--jp-ui-font-color2)' }}>
              monitor_heart
            </span>
            <div>View connection logs</div>
          </div>
          <div onClick={viewSparkOptions}>
            <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'var(--jp-ui-font-color2)' }}>
              settings
            </span>
            <div>View current Spark options</div>
          </div>
          {!notebookMetadata && !!activeNotebookPanel && (
            <div onClick={attachConfigToNotebook}>
              <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'var(--jp-ui-font-color2)' }}>
                attach_file_add
              </span>
              <div>Attach config to notebook</div>
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
