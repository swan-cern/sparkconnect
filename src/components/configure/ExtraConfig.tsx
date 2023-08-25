/**
 * ExtraConfig
 * This file contains the UI to select extra configuration in the configure page.
 */
import React, { useMemo } from 'react';
import { showDialog } from '@jupyterlab/apputils';
import AddExtraConfigDialog from './AddExtraConfigDialog';
import { UIStore } from '../../store/UIStore';
import '../../../style/ExtraConfig.css';

interface MyProps {
  clusterName: string;
  selectedConfigBundles: string[];
  extraConfig: { [key: string]: any };
  setExtraConfig: (extraConfig: { [key: string]: any }) => void;
}

const ExtraConfig: React.FC<MyProps> = ({ clusterName, selectedConfigBundles, extraConfig, setExtraConfig }) => {
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

  const addExtraConfig = () => {
    showDialog({
      title: 'Add extra configuration',
      body: new AddExtraConfigDialog(clusterName, selectedConfigBundles)
    }).then(value => {
      if (value.value) {
        setExtraConfig({ ...extraConfig, [value.value?.config]: value.value?.value });
      }
    });
  };

  return (
    <div>
      <div className="jp-SparkConnectExtension-ExtraConfig-list">
        {Object.keys(extraConfig).map(key => (
          <div key={key}>
            <span className="icon-settings material-symbols-outlined">settings</span>
            <div className="div-left">
              <div className="config-name">{key}</div>
              <div className="config-value">{extraConfig[key]}</div>
              {key in configuredOptionsFromBundle && (
                <div className="override-warning">
                  Overrides <b>{configuredOptionsFromBundle[key]}</b>
                </div>
              )}
            </div>
            <span
              className="icon-delete material-symbols-outlined"
              onClick={() => {
                delete extraConfig[key];
                setExtraConfig({ ...extraConfig });
              }}
            >
              delete
            </span>
          </div>
        ))}
      </div>
      <div className="jp-SparkConnectExtension-ExtraConfig-addContainer">
        <button className="jp-ToolbarButtonComponent jp-mod-minimal jp-Button" onClick={addExtraConfig}>
          <span className="material-symbols-outlined">add_circle</span>
          <span className="jp-ToolbarButtonComponent-label">Add</span>
        </button>
      </div>
    </div>
  );
};

export default ExtraConfig;
