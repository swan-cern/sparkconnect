import React from 'react';
import UseAnimations from 'react-useanimations';
import checkBox from 'react-useanimations/lib/checkBox';
import { showDialog } from '@jupyterlab/apputils';
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
    console.log(isSelected);
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
          accept: true,
          displayType: 'default',
          ariaLabel: '',
          iconClass: '',
          iconLabel: '',
          actions: []
        }
      ],
      body: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: 400 }}>
          {bundle.options.map(option => (
            <div>
              <div>{option.name}</div>
              <small style={{ color: 'var(--jp-ui-font-color2)' }}>{option.value}</small>
            </div>
          ))}
        </div>
      )
    });
  };

  return (
    <div className="jp-SparkConnectExtension-configBundle-list">
      {configBundles.map(bundle => {
        const isSelected = selected.includes(bundle.value);
        return (
          <UseAnimations
            key={bundle.value}
            animation={checkBox}
            size={20}
            speed={2}
            reverse={isSelected}
            onClick={() => toggle(bundle.value)}
            strokeColor={isSelected ? 'var(--md-green-600)' : 'var(--jp-ui-font-color2)'}
            render={(eventProps, animationProps) => (
              <div {...eventProps} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <div {...animationProps} />
                <span style={{ color: 'var(--jp-ui-font-color1)', flex: 1, textOverflow: 'ellipsis', overflow: 'hidden' }}>{bundle.label}</span>
                <div
                  onClick={e => {
                    showDetails(bundle.bundle);
                    e.stopPropagation();
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'var(--jp-content-link-color)' }}>
                    info
                  </span>
                </div>
              </div>
            )}
          />
        );
      })}
    </div>
  );
};

export default ConfigBundle;
