import React, { useState } from 'react';
import SparkLogo from './SparkLogo';
import Select from './Select';
import { Section } from './Section';
import ConfigBundle from './configure/ConfigBundle';
import { UIStore } from '../store/UIStore';
import ExtraConfig from './configure/ExtraConfig';

const Configure: React.FC = () => {
  const clusterOptions = UIStore.useState(s => s.clusters).map(c => ({ label: c.displayName, value: c.name }));

  const [cluster, setCluster] = useState<{ label: String; value: string }>();
  const [selectedConfigBundles, setSelectedConfigBundles] = useState<string[]>([]);
  const [extraConfig, setExtraConfig] = useState<{ [key: string]: any }>({});

  return (
    <div style={{ flex: 1, overflow: 'auto' }}>
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
        </>
      )}
    </div>
  );
};

export default Configure;
