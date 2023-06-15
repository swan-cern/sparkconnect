import React, { useEffect } from 'react';
import MoonLoader from 'react-spinners/MoonLoader';
import SparkLogo from './SparkLogo';
import useStatus from '../hooks/useStatus';
import { UIStore } from '../store/UIStore';

const Provisioning: React.FC = () => {
  const { mutate } = useStatus();

  useEffect(() => {
    const handle = setInterval(mutate, 1000);
    return () => clearInterval(handle);
  }, []);

  const clusterName = UIStore.useState(s => s.clusterName);
  const clusters = UIStore.useState(s => s.clusters);
  const clusterDisplayName = clusters.find(c => c.name === clusterName)?.displayName;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', textAlign: 'center', alignItems: 'center', justifyContent: 'center' }}>
        <SparkLogo />
        <h3 className="jp-SparkConnectExtension-heading">Connecting</h3>
        <p style={{ marginTop: 8 }}>
          Please wait, we're connecting to <b>{clusterDisplayName}</b>.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 120, marginTop: 8 }}>
          <MoonLoader size={36} color="var(--jp-ui-font-color1)" />
        </div>
      </div>
      <div style={{ padding: 8 }}>
        <button className="jp-Button jp-mod-styled jp-mod-accept" style={{ width: '100%' }}>
          View log
        </button>
      </div>
    </div>
  );
};

export default Provisioning;
