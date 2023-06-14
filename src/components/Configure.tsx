import React, { useMemo, useState } from 'react';
import SparkLogo from './SparkLogo';
import Select from './Select';
import { Section } from './Section';
import ConfigBundle from './configure/ConfigBundle';
import { TextField } from './TextField';
import { UIStore } from '../store/UIStore';

const Configure: React.FC = () => {
  const clusterOptions = UIStore.useState(s => s.clusters).map(c => ({ label: c.displayName, value: c.name }));
  const configOptions = UIStore.useState(s => s.configOptions);
  const groupedConfigOptions = useMemo(() => {
    const map = configOptions.reduce((acc, curr) => {
      const cat = curr.category ?? 'Other';
      if (!(cat in acc)) {
        acc[cat] = [];
      }
      acc[cat].push(curr);
      return acc;
    }, {} as any);

    return Object.keys(map).map(category => ({
      category,
      options: map[category].map((c: any) => ({ label: c.name, value: c.name }))
    }));
  }, [configOptions]);

  const formatGroupLabel = (data: any) => (
    <div>
      <span>{data.category}</span>
    </div>
  );

  const [cluster, setCluster] = useState<{ label: String; value: string }>();
  const [selectedConfigBundles, setSelectedConfigBundles] = useState<string[]>([]);
  const [configOption, setConfigOption] = useState<{ label: String; value: string }>();

  const configBundles = UIStore.useState(s => s.configBundleOptions);
  const configuredOptionsFromBundle = useMemo(() => {
    if (!cluster) return;

    const map: any = {};
    configBundles
      .filter(b => selectedConfigBundles.includes(b.name))
      .filter(b => !b.clusterFilter || b.clusterFilter.includes(cluster.value))
      .forEach(bundle => {
        bundle.options.forEach(option => (map[option.name] = bundle.displayName));
      });
    return map;
  }, [configBundles, cluster, selectedConfigBundles]);

  const overridenConfigBundle = useMemo(() => {
    if (!configuredOptionsFromBundle || !configOption) return;
    return configuredOptionsFromBundle[configOption.value];
  }, [selectedConfigBundles, configuredOptionsFromBundle, configOption]);

  return (
    <div style={{ flex: 1 }}>
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
          <Section title="Extra Configuration" style={{ padding: 8 }} headingStyle={{ marginTop: 16 }}>
            <Select placeholder="Option" options={groupedConfigOptions} formatGroupLabel={formatGroupLabel} value={configOption} onChange={v => setConfigOption(v as any)} isClearable />
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
            {!!overridenConfigBundle && (
              <div
                style={{ fontSize: '11px', marginTop: 8, padding: 4, borderRadius: 'var(--jp-border-radius)', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 4, color: 'var(--jp-warn-color1)', border: '1px solid var(--jp-warn-color2)' }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                  error
                </span>
                <div>
                  This will override <b>{overridenConfigBundle}</b>.
                </div>
              </div>
            )}
          </Section>
        </>
      )}
    </div>
  );
};

export default Configure;
