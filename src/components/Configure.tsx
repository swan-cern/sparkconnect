import React from 'react';
import SparkLogo from './SparkLogo';

const Configure: React.FC = () => {
  return (
    <div style={{ padding: 12 }}>
      <SparkLogo />
      <h2 className='jp-SparkConnectExtension-heading'>Connect to Cluster</h2>
    </div>
  );
};

export default Configure;
