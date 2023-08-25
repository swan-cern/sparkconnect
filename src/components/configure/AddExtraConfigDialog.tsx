/**
 * AddExtraConfigDialog
 * This file contains the UI to add extra Spark configuration on the configuration page.
 */
import React, { useEffect, useMemo, useState } from 'react';
import '../../../style/AddExtraConfigDialog.css';
import { ReactWidget } from '@jupyterlab/ui-components';
import { Dialog } from '@jupyterlab/apputils';
import { UIStore } from '../../store/UIStore';
import Select from '../Select';
import { TextField } from '../TextField';

export interface DialogResult {
  config: string;
  value: string;
}

export default class AddExtraConfigDialog extends ReactWidget implements Dialog.IBodyWidget<DialogResult | null> {
  clusterName: string;
  selectedConfigBundles: string[];
  selectedConfig?: string;
  configValue?: string;

  constructor(clusterName: string, selectedConfigBundles: string[]) {
    super();
    this.clusterName = clusterName;
    this.selectedConfigBundles = selectedConfigBundles;
  }

  render() {
    return <_AddExtraConfigDialog clusterName={this.clusterName} selectedConfigBundles={this.selectedConfigBundles} onSetConfig={s => (this.selectedConfig = s)} onSetValue={s => (this.configValue = s)} />;
  }

  getValue() {
    if (!this.selectedConfig || !this.configValue) {
      return null;
    }

    return {
      config: this.selectedConfig,
      value: this.configValue
    };
  }
}

interface MyProps {
  clusterName: string;
  selectedConfigBundles: string[];
  onSetConfig: (config: string) => void;
  onSetValue: (value: string) => void;
}

function _AddExtraConfigDialog({ clusterName, selectedConfigBundles, onSetConfig, onSetValue }: MyProps) {
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

  const configBundles = UIStore.useState(s => s.configBundleOptions);
  const configuredOptionsFromBundle = useMemo(() => {
    const map: any = {};
    configBundles
      .filter(b => selectedConfigBundles.includes(b.name))
      .filter(b => !b.clusterFilter || b.clusterFilter.includes(clusterName))
      .forEach(bundle => {
        bundle.options.forEach(option => (map[option.name] = bundle.displayName));
      });
    return map;
  }, [configBundles, clusterName, selectedConfigBundles]);

  const [configOption, setConfigOption] = useState<{ label: String; value: string }>();
  useEffect(() => {
    if (configOption) onSetConfig(configOption.value);
  }, [configOption]);

  const [value, setValue] = useState<string>('');
  useEffect(() => {
    onSetValue(value);
  }, [value]);

  const overridenConfigBundle = useMemo(() => {
    if (!configuredOptionsFromBundle || !configOption) return;
    return configuredOptionsFromBundle[configOption.value];
  }, [selectedConfigBundles, configuredOptionsFromBundle, configOption]);

  const formatGroupLabel = (data: any) => (
    <div>
      <span>{data.category}</span>
    </div>
  );

  return (
    <div className="jp-SparkConnectExtension-AddExtraConfigDialog-container">
      <Select placeholder="Option" menuPosition="fixed" options={groupedConfigOptions} formatGroupLabel={formatGroupLabel} value={configOption} onChange={v => setConfigOption(v as any)} isClearable />
      <div className="jp-SparkConnectExtension-spacer-8" />
      <TextField placeholder="Value" value={value} onChange={e => setValue(e.target.value)} />
      <div className="jp-SparkConnectExtension-AddExtraConfigDialog-helpText">
        <small>
          To use environment variables, input{' '}
          <code>
            <small>{'{ENV_VAR_NAME}'}</small>
          </code>
          .
        </small>
      </div>
      {!!overridenConfigBundle && (
        <div className="jp-SparkConnectExtension-AddExtraConfigDialog-duplicateWarning">
          <span className="material-symbols-outlined">error</span>
          <div>
            This will override <b>{overridenConfigBundle}</b>.
          </div>
        </div>
      )}
    </div>
  );
}
