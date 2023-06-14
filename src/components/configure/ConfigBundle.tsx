import React from 'react';
import UseAnimations from 'react-useanimations';
import checkBox from 'react-useanimations/lib/checkBox';
import { UIStore } from '../../store/UIStore';

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
      value: b.name
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
              <div {...eventProps}>
                <div {...animationProps} />
                <span style={{ color: 'var(--jp-ui-font-color1)' }}>{bundle.label}</span>
              </div>
            )}
          />
        );
      })}
    </div>
  );
};

export default ConfigBundle;
