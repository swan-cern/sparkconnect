import React, { useState } from 'react';
import UseAnimations from 'react-useanimations';
import checkBox from 'react-useanimations/lib/checkBox';

const ConfigBundle: React.FC = () => {
  const configBundles = [
    { label: 'Long running analysis', value: 'longRunningAnalysis' },
    { label: 'Memory-intensive', value: 'memoryIntensive' },
    { label: 'Compute-intensive', value: 'computeIntensive' },
    { label: 'Enable Spark metrics', value: 'enableSparkMetrics' },
    { label: 'Enable S3 filesystem', value: 'enableS3Filesystem' },
  ];

  const [selected, setSelected] = useState<string[]>([]);

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
            animation={checkBox}
            size={20}
            speed={2}
            reverse={isSelected}
            onClick={() => toggle(bundle.value)}
            strokeColor={isSelected ? 'var(--md-green-600)' : 'var(--jp-ui-font-color2)'}
            render={(eventProps, animationProps) => (
              <div {...eventProps}>
                <div {...animationProps} />
                <span style={{ color: 'var(--jp-ui-font-color1)' }}>
                  {bundle.label}
                </span>
              </div>
            )}
          />
        );
      })}
    </div>
  );
};

export default ConfigBundle;
