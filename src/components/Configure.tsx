import React from 'react';
import SparkLogo from './SparkLogo';
import Select from './Select';
import { Section } from './Section';
import ConfigBundle from './configure/ConfigBundle';
import { TextField } from './TextField';

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
        headingStyle={{ marginTop: 16 }}
      >
        <Select options={options} />
      </Section>
      <Section title="Configuration Bundle" headingStyle={{ marginTop: 8 }}>
        <ConfigBundle />
      </Section>
      <Section
        title="Extra Configuration"
        style={{ padding: 8 }}
        headingStyle={{ marginTop: 16 }}
      >
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
    </div>
  );
};

export default Configure;
