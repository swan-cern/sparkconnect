import React from 'react';
import { ExtensionState } from '../types';
import Configure from './Configure';

const Panel: React.FC = () => {
  const currentState = ExtensionState.CONFIGURING;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {currentState === ExtensionState.CONFIGURING && <Configure />}
    </div>
  );
};

export default Panel;
