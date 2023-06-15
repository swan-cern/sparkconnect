import React from 'react';
import MoonLoader from 'react-spinners/MoonLoader';
import SparkLogo from './SparkLogo';

const Provisioning: React.FC = () => {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', textAlign: 'center', alignItems: 'center', justifyContent: 'center' }}>
        <SparkLogo />
        <h3 className="jp-SparkConnectExtension-heading">Connecting</h3>
        <p style={{ marginTop: 8 }}>
          Please wait, we're connecting to <b>Analytix</b>.
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
