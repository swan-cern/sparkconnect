import React from 'react';
import { showDialog } from '@jupyterlab/apputils';
import AddExtraConfigDialog from './AddExtraConfigDialog';

interface MyProps {
  clusterName: string;
  selectedConfigBundles: string[];
  extraConfig: { [key: string]: any };
  setExtraConfig: (extraConfig: { [key: string]: any }) => void;
}

const ExtraConfig: React.FC<MyProps> = ({ clusterName, selectedConfigBundles, extraConfig, setExtraConfig }) => {
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
      <div className="jp-SparkConnectExtension-extraConfig-list">
        {Object.keys(extraConfig).map(key => (
          <div key={key} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
              settings
            </span>
            <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
              <div style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>{key}</div>
              <div style={{ color: 'var(--jp-ui-font-color2)' }}>{extraConfig[key]}</div>
            </div>
            <span
              className="material-symbols-outlined"
              style={{ fontSize: 18, color: 'var(--jp-error-color1)', cursor: 'pointer' }}
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
      <div style={{ padding: 8 }}>
        <button onClick={addExtraConfig} className="jp-Button jp-mod-styled jp-mod-reject" style={{ width: '100%' }}>
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
            add_circle
          </span>{' '}
          &nbsp;Add
        </button>
      </div>
    </div>
  );
};

export default ExtraConfig;
