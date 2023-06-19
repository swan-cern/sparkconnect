import React, { useEffect, useMemo, useState } from 'react';
import { showDialog } from '@jupyterlab/apputils';
import SparkLogo from '../SparkLogo';
import Select from '../Select';
import { Section } from '../Section';
import ConfigBundle from '../configure/ConfigBundle';
import { UIStore } from '../../store/UIStore';
import ExtraConfig from '../configure/ExtraConfig';
import { requestAPI } from '../../handler';
import useStatus from '../../hooks/useStatus';

const Configure: React.FC = () => {
  const clusterOptions = UIStore.useState(s => s.clusters).map(c => ({ label: c.displayName, value: c.name }));

  const [cluster, setCluster] = useState<{ label: String; value: string }>();
  const [selectedConfigBundles, setSelectedConfigBundles] = useState<string[]>([]);
  const [extraConfig, setExtraConfig] = useState<{ [key: string]: any }>({});

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

  const loadConfigFromMetadata = () => {
    const cluster = clusterOptions.find(o => o.value === notebookMetadata.cluster_name);
    setCluster(cluster);
    setSelectedConfigBundles(notebookMetadata.bundled_options);
    setExtraConfig(
      notebookMetadata.list_of_options.reduce((acc: any, curr: any) => {
        acc[curr.name] = curr.value;
        return acc;
      }, {})
    );
  };

  const configBundles = UIStore.useState(s => s.configBundleOptions);
  const configuredOptionsFromBundle = useMemo(() => {
    if (!cluster) return {};

    const map: any = {};
    configBundles
      .filter(b => selectedConfigBundles.includes(b.name))
      .filter(b => !b.clusterFilter || b.clusterFilter.includes(cluster.value))
      .forEach(bundle => {
        bundle.options.forEach(option => {
          if (!map[option.name] || option.concatenate === undefined) {
            map[option.name] = option.value;
          } else {
            map[option.name] = `${map[option.name] ?? ''}${option.concatenate}${option.value}`;
          }
        });
      });
    return map;
  }, [configBundles, cluster?.value, selectedConfigBundles]);

  const configuredOptions: { [key: string]: any } = { ...configuredOptionsFromBundle, ...extraConfig };

  const reviewConfiguration = () => {
    showDialog({
      title: 'Review configuration',
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
          {Object.keys(configuredOptions).length === 0 && <div>No configuration</div>}
          {Object.keys(configuredOptions).map(option => (
            <div>
              <div>{option}</div>
              <small style={{ color: 'var(--jp-ui-font-color2)' }}>{configuredOptions[option]}</small>
            </div>
          ))}
        </div>
      )
    });
  };

  const { mutate } = useStatus();
  const connect = () => {
    UIStore.update(s => {
      s.isConnecting = true;
      s.clusterName = cluster?.value;
    });

    const requestBody = {
      cluster: cluster?.value,
      options: configuredOptions,
      configBundles: selectedConfigBundles,
      extraConfig: extraConfig
    };

    requestAPI<any>('/cluster/start', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: { 'Content-Type': 'application/json' }
    })
      .then(mutate)
      .finally(() => {
        UIStore.update(s => {
          s.isConnecting = false;
        });
      });
  };

  return (
    <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
      <div style={{ padding: 8 }}>
        <SparkLogo />
        <h3 className="jp-SparkConnectExtension-heading">Connect to Cluster</h3>
      </div>
      {!!notebookMetadata && (
        <div style={{ padding: 8 }}>
          <div
            onClick={loadConfigFromMetadata}
            style={{ padding: 8, cursor: 'pointer', borderRadius: 'var(--jp-border-radius)', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 8, color: 'var(--jp-ui-inverse-font-color1)', background: 'var(--jp-info-color1)' }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
              settings
            </span>
            <div>Load attached configuration</div>
          </div>
        </div>
      )}
      <Section title="Cluster" style={{ padding: 8 }} headingStyle={{ marginTop: 16 }}>
        <Select options={clusterOptions} value={cluster} onChange={v => setCluster(v as any)} />
      </Section>
      {!!cluster && (
        <>
          <Section title="Configuration Bundle" headingStyle={{ marginTop: 8 }}>
            <ConfigBundle clusterName={cluster.value} selected={selectedConfigBundles} setSelected={setSelectedConfigBundles} />
          </Section>
          <Section title="Extra Configuration" headingStyle={{ marginTop: 16 }}>
            <ExtraConfig clusterName={cluster.value} selectedConfigBundles={selectedConfigBundles} extraConfig={extraConfig} setExtraConfig={setExtraConfig} />
          </Section>
          <div style={{ flex: 1 }} />
          <div style={{ padding: 8 }}>
            <button className="jp-Button jp-mod-styled jp-mod-reject" onClick={reviewConfiguration} style={{ width: '100%' }}>
              Review configuration
            </button>
            <button className="jp-Button jp-mod-styled jp-mod-accept" onClick={connect} style={{ width: '100%', marginTop: 8 }}>
              Connect
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Configure;
