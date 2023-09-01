/**
 * Provisioning
 * This file contains a loading page shown when the server extension is starting the Spark Connect server.
 */
import React, { useEffect } from 'react';
import MoonLoader from 'react-spinners/MoonLoader';
import SparkLogo from '../SparkLogo';
import useStatus from '../../hooks/useStatus';
import useCluster from '../../hooks/useCluster';
import useJupyterLabApp from '../../hooks/useJupyterLabApp';
import { UIStore } from '../../store/UIStore';
import '../../../style/Provisioning.css';

const Provisioning: React.FC = () => {
  const { mutate } = useStatus();

  const poll = () => {
    mutate().then(val => {
      // If the status is stopped in the middle of connecting, flag as failed
      const isWaitingForConnectResponse = UIStore.getRawState().isConnecting;
      if (!isWaitingForConnectResponse && val?.status === 'STOPPED') {
        UIStore.update(s => {
          s.isConnectionFailed = true;
        });
      }
    });
  };

  useEffect(() => {
    const handle = setInterval(poll, 4000);
    return () => clearInterval(handle);
  }, []);

  const cluster = useCluster();

  const app = useJupyterLabApp();
  const viewLogs = () => {
    app?.commands.execute('sparkconnect:viewLogs');
  };

  return (
    <div className="jp-SparkConnectExtension-Provisioning-root">
      <div className="jp-SparkConnectExtension-Provisioning-main">
        <SparkLogo />
        <h3 className="jp-SparkConnectExtension-heading">Connecting</h3>
        <p className="msg">
          Please wait, we're connecting to <b>{cluster?.displayName}</b>.
        </p>
        <div className="loading-container">
          <MoonLoader size={36} color="var(--jp-ui-font-color1)" />
        </div>
      </div>
      <div className="cta-container">
        <button className="jp-Button jp-mod-styled jp-mod-reject" onClick={viewLogs}>
          View connection logs
        </button>
      </div>
    </div>
  );
};

export default Provisioning;
