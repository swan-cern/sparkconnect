import React from 'react';
import MoonLoader from 'react-spinners/MoonLoader';

const LoadingState: React.FC = () => {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', textAlign: 'center', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 120, marginTop: 8 }}>
          <MoonLoader size={36} color="var(--jp-ui-font-color1)" />
        </div>
      </div>
    </div>
  );
};

export default LoadingState;
