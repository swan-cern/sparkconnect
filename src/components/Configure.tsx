import React, { useState } from 'react';
import SparkLogo from './SparkLogo';
import Select from './Select';
import { Section } from './Section';
import ConfigBundle from './configure/ConfigBundle';
import { TextField } from './TextField';
import { UIStore } from '../store/UIStore';

const Configure: React.FC = () => {
  const options = UIStore.useState(s => s.clusters).map(c => ({ label: c.displayName ?? c.name, value: c.name }));

  const [cluster, setCluster] = useState<{ label: String; value: string }>();
  const [selectedConfigBundles, setSelectedConfigBundles] = useState<string[]>([]);

  return (
    <div style={{ flex: 1 }}>
      <div style={{ padding: 8 }}>
        <SparkLogo />
        <h3 className="jp-SparkConnectExtension-heading">Connect to Cluster</h3>
      </div>
      <Section title="Cluster" style={{ padding: 8 }} headingStyle={{ marginTop: 16 }}>
        <Select options={options} value={cluster} onChange={v => setCluster(v as any)} />
      </Section>
      {!!cluster && (
        <>
          <Section title="Configuration Bundle" headingStyle={{ marginTop: 8 }}>
            <ConfigBundle clusterName={cluster.value} selected={selectedConfigBundles} setSelected={setSelectedConfigBundles} />
          </Section>
          <Section title="Extra Configuration" style={{ padding: 8 }} headingStyle={{ marginTop: 16 }}>
            <TextField placeholder="Option" />
            <div style={{ marginTop: 8 }} />
            <TextField placeholder="Value" />
            <div style={{ marginLeft: 8, marginTop: 4, color: 'var(--jp-ui-font-color2)' }}>
              <small>
                To use environment variables, input{' '}
                <code>
                  <small>{'{ENV_VAR_NAME}'}</small>
                </code>
                .
              </small>
            </div>
          </Section>
        </>
      )}
    </div>
  );
};

export default Configure;
