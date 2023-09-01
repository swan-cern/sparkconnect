/**
 * LoadingState
 * This file contains an empty loading progress circle displayed when the extension is fetching its state from the server extension.
 */
import React from 'react';
import MoonLoader from 'react-spinners/MoonLoader';
import '../../../style/LoadingState.css';

const LoadingState: React.FC = () => {
  return (
    <div className="jp-SparkConnectExtension-LoadingState-root">
      <div className="jp-SparkConnectExtension-LoadingState-content">
        <div className="jp-SparkConnectExtension-LoadingState-loading-container">
          <MoonLoader size={36} color="var(--jp-ui-font-color1)" />
        </div>
      </div>
    </div>
  );
};

export default LoadingState;
