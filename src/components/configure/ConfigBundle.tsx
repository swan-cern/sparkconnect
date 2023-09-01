/**
 * ConfigBundle
 * This file contains the UI to select configuration bundles in the configure page.
 */
import React from 'react';
import { showDialog } from '@jupyterlab/apputils';
import '../../../style/ConfigBundle.css';
import { UIStore } from '../../store/UIStore';
import { SparkConfigBundle } from '../../types';

interface MyProps {
  clusterName: string;
  selected: string[];
  setSelected: (selected: string[]) => void;
}

const ConfigBundle: React.FC<MyProps> = ({ clusterName, selected, setSelected }) => {
  const configBundles = UIStore.useState(s => s.configBundleOptions)
    .filter(b => !b.clusterFilter || b.clusterFilter.includes(clusterName))
    .map(b => ({
      label: b.displayName,
      value: b.name,
      bundle: b
    }));

  const toggle = (value: string) => {
    const isSelected = selected.includes(value);
    if (!isSelected) {
      setSelected([...selected, value]);
    } else {
      setSelected(selected.filter(x => x !== value));
    }
  };

  const showDetails = (bundle: SparkConfigBundle) => {
    showDialog({
      title: bundle.displayName,
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
        <div className="jp-SparkConnectExtension-ConfigBundle-bundleDetails-root">
          {bundle.options.map(option => (
            <div>
              <div>{option.name}</div>
              <small className="bundleValue">{option.value}</small>
            </div>
          ))}
        </div>
      )
    });
  };

  return (
    <div className="jp-SparkConnectExtension-ConfigBundle-list">
      {configBundles.map(bundle => {
        const isSelected = selected.includes(bundle.value);
        return (
          <div key={bundle.value} onClick={() => toggle(bundle.value)}>
            <div>
              {isSelected && (
                <div className="jp-SparkConnectExtension-ConfigBundle-list-checkbox checked">
                  <div />
                </div>
              )}
              {!isSelected && <div className="jp-SparkConnectExtension-ConfigBundle-list-checkbox"></div>}
            </div>
            <span className="bundleLabel">{bundle.label}</span>
            <div
              onClick={e => {
                showDetails(bundle.bundle);
                e.stopPropagation();
              }}
            >
              <span className="material-symbols-outlined">info</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ConfigBundle;
