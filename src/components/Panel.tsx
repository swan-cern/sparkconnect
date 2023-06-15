import React from 'react';
import { ExtensionState } from '../types';
import Configure from './Configure';
import Provisioning from './Provisioning';

const Panel: React.FC = () => {
  const currentState = (() => ExtensionState.PROVISIONING)();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {currentState === ExtensionState.CONFIGURING && <Configure />}
      {currentState === ExtensionState.PROVISIONING && <Provisioning />}
    </div>
  );
};

export default Panel;
