import React, { useState } from 'react';
import SparkLogo from './SparkLogo';
import Select from './Select';
import { Section } from './Section';
import ConfigBundle from './configure/ConfigBundle';
import { UIStore } from '../store/UIStore';
import ExtraConfig from './configure/ExtraConfig';
import { requestAPI } from '../handler';
import useStatus from '../hooks/useStatus';

const Configure: React.FC = () => {
  const clusterOptions = UIStore.useState(s => s.clusters).map(c => ({ label: c.displayName, value: c.name }));

  const [cluster, setCluster] = useState<{ label: String; value: string }>();
  const [selectedConfigBundles, setSelectedConfigBundles] = useState<string[]>([]);
  const [extraConfig, setExtraConfig] = useState<{ [key: string]: any }>({});

  const { mutate } = useStatus();
  const connect = () => {
    UIStore.update(s => {
      s.isConnecting = true;
      s.clusterName = cluster?.value;
    });

    const requestBody = {
      cluster: cluster?.value
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
            <button className="jp-Button jp-mod-styled jp-mod-accept" onClick={connect} style={{ width: '100%' }}>
              Connect
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Configure;
