import React, { useEffect, useMemo } from 'react';
import { ExtensionState } from '../../types';
import Configure from '../pages/Configure';
import Provisioning from '../pages/Provisioning';
import { UIStore } from '../../store/UIStore';
import useStatus from '../../hooks/useStatus';
import Ready from '../pages/Ready';
import Failed from '../pages/Failed';

const Panel: React.FC = () => {
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
  const isConnecting = UIStore.useState(s => s.isConnecting);
  const isConnectionFailed = UIStore.useState(s => s.isConnectionFailed);
  const currentState = useMemo(() => {
    if (isConnecting) {
      return ExtensionState.PROVISIONING;
    }

    if (isConnectionFailed) {
      return ExtensionState.ERROR;
    }

    if (status === 'PROVISIONING') {
      return ExtensionState.PROVISIONING;
    }

    if (status === 'READY') {
      return ExtensionState.READY;
    }

    return ExtensionState.CONFIGURING;
  }, [status, isConnecting, isConnectionFailed]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {currentState === ExtensionState.CONFIGURING && <Configure />}
      {currentState === ExtensionState.PROVISIONING && <Provisioning />}
      {currentState === ExtensionState.READY && <Ready />}
      {currentState === ExtensionState.ERROR && <Failed />}
    </div>
  );
};

export default Panel;
