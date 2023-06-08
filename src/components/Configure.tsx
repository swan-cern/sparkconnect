import React from 'react';
import SparkLogo from './SparkLogo';
import Select from './Select';
import { Section } from './Section';

const Configure: React.FC = () => {
  const options = [
    { label: 'Cloud Containers (k8s)', value: 'k8s' },
    { label: 'Analytix', value: 'analytix' }
  ];
  return (
    <div style={{ flex: 1 }}>
      <div style={{ padding: 8 }}>
        <SparkLogo />
        <h3 className="jp-SparkConnectExtension-heading">Connect to Cluster</h3>
      </div>
      <Section
        title="Cluster"
        style={{ padding: 8 }}
        headingStyle={{ marginTop: 8 }}
      >
        <Select options={options} />
      </Section>
      <Section
        title="Configuration Bundle"
        style={{ padding: 8 }}
        headingStyle={{ marginTop: 8 }}
      >
        Config bundles
      </Section>
      <Section
        title="Extra Configuration"
        style={{ padding: 8 }}
        headingStyle={{ marginTop: 8 }}
      >
        Extra configs
      </Section>
    </div>
  );
};

export default Configure;
