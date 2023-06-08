import React from 'react';
import { ExtensionState } from '../types';
import Configure from './Configure';

const Panel: React.FC = () => {
  const currentState = ExtensionState.CONFIGURING;

  return (
    <div className="jp-SparkConnectExtension-scrollable">
      {currentState === ExtensionState.CONFIGURING && <Configure />}
    </div>
  );
};

export default Panel;
