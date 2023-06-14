import React from 'react';
import { showDialog } from '@jupyterlab/apputils';
import AddExtraConfigDialog from './AddExtraConfigDialog';

interface MyProps {
  clusterName: string;
  selectedConfigBundles: string[];
  extraConfig: { [key: string]: any };
  setExtraConfig: (extraConfig: { [key: string]: any }) => void;
}

const ExtraConfig: React.FC<MyProps> = ({ clusterName, selectedConfigBundles, extraConfig, setExtraConfig }) => {
  const addExtraConfig = () => {
    showDialog({
      title: 'Add extra configuration',
      body: new AddExtraConfigDialog(clusterName, selectedConfigBundles)
    }).then(value => {
      console.log(value);
    });
  };

  return (
    <div>
      <button onClick={addExtraConfig} className="jp-Button" style={{ width: '100%' }}>
        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
          add_circle
        </span>{' '}
        &nbsp;Add
      </button>
    </div>
  );
};

export default ExtraConfig;
