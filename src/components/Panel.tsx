import React, { useEffect, useMemo } from 'react';
import { ExtensionState } from '../types';
import Configure from './Configure';
import Provisioning from './Provisioning';
import { UIStore } from '../store/UIStore';
import useStatus from '../hooks/useStatus';

const Panel: React.FC = () => {
  const isConnecting = UIStore.useState(s => s.isConnecting);
  const { data } = useStatus();
  const clusterName = data?.clusterName;
  useEffect(() => {
    if (!!clusterName) {
      UIStore.update(s => {
        s.clusterName = clusterName;
      });
    }
  }, [clusterName]);

  const status = data?.status;
  const currentState = useMemo(() => {
    if (isConnecting) {
      return ExtensionState.PROVISIONING;
    }

    if (status === 'PROVISIONING') {
      return ExtensionState.PROVISIONING;
    }

    if (status === 'READY') {
      return ExtensionState.READY;
    }

    return ExtensionState.CONFIGURING;
  }, [status, isConnecting]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {currentState === ExtensionState.CONFIGURING && <Configure />}
      {currentState === ExtensionState.PROVISIONING && <Provisioning />}
    </div>
  );
};

export default Panel;
