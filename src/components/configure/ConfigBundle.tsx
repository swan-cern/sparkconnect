import React from 'react';
import UseAnimations from 'react-useanimations';
import plusToX from 'react-useanimations/lib/plusToX';

const ConfigBundle: React.FC = () => {
  const configBundles = [
    { label: 'Long Running Analysis', value: 'longRunningAnalysis' },
    { label: 'Memory Intensive', value: 'longRunningAnalysis' }
  ];

  return (
    <div className="jp-SparkConnectExtension-configBundle-list">
      {configBundles.map(bundle => (
        <div>
          <UseAnimations animation={plusToX} />
          {bundle.label}
        </div>
      ))}
    </div>
  );
};

export default ConfigBundle;
