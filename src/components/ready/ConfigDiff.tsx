import React from 'react';
import { UIStore } from '../../store/UIStore';
import '../../../style/ConfigDiff.css';

interface NotebookMetadata {
  cluster_name: string;
  bundled_options: string[];
  list_of_options: Array<{
    name: string;
    value: any;
  }>;
}

interface MyProps {
  currentConfig: NotebookMetadata;
  notebookConfig: NotebookMetadata;
}

export default function ConfigDiff({ currentConfig, notebookConfig }: MyProps) {
  const configBundles = UIStore.useState(s => s.configBundleOptions);
  const clusters = UIStore.useState(s => s.clusters);

  const getClusterName = (clusterName: string) => clusters.find(c => c.name === clusterName)?.displayName;

  const getSparkOptions = (metadata: NotebookMetadata) => {
    const map: any = {};

    configBundles
      .filter(b => metadata.bundled_options.includes(b.name))
      .filter(b => !b.clusterFilter || b.clusterFilter.includes(metadata.cluster_name))
      .forEach(bundle => {
        bundle.options.forEach(option => {
          if (!map[option.name] || option.concatenate === undefined) {
            map[option.name] = option.value;
          } else {
            map[option.name] = `${map[option.name] ?? ''}${option.concatenate}${option.value}`;
          }
        });
      });

    // Note: existing config will be overriden WITHOUT concatenation
    metadata.list_of_options.forEach(({ name, value }) => {
      map[name] = value;
    });
    return map;
  };

  const currentSparkOptions = getSparkOptions(currentConfig);
  const notebookSparkOptions = getSparkOptions(notebookConfig);

  const difference = Object.keys(currentSparkOptions)
    .filter(x => !Object.keys(notebookSparkOptions).includes(x))
    .concat(Object.keys(notebookSparkOptions).filter(x => !Object.keys(currentSparkOptions).includes(x)));

  return (
    <div>
      <div className="jp-SparkConnectExtension-ConfigDiff-main">
        {currentConfig.cluster_name !== notebookConfig.cluster_name && <DiffItem optionName="Cluster Name" currentValue={getClusterName(currentConfig.cluster_name)} notebookValue={getClusterName(notebookConfig.cluster_name)} />}
        {difference.map(opt => (
          <DiffItem key={opt} optionName={<code>{opt}</code>} currentValue={currentSparkOptions[opt]} notebookValue={notebookSparkOptions[opt]} />
        ))}
      </div>
    </div>
  );
}

interface DiffItemProps {
  optionName: React.ReactNode;
  currentValue?: string;
  notebookValue?: string;
}

function DiffItem({ optionName, currentValue, notebookValue }: DiffItemProps) {
  return (
    <div className="jp-SparkConnectExtension-warning-diffItem">
      <div className="jp-SparkConnectExtension-warning-diffItem-title">{optionName}</div>
      <div>
        <div className="jp-SparkConnectExtension-warning-diffItem-row">
          <div className="jp-SparkConnectExtension-warning-diffItem-row-title">Current</div>
          <div className="jp-SparkConnectExtension-warning-diffItem-row-content">{currentValue ?? <i>undefined</i>}</div>
        </div>
        <div className="jp-SparkConnectExtension-warning-diffItem-row">
          <div className="jp-SparkConnectExtension-warning-diffItem-row-title">Notebook</div>
          <div className="jp-SparkConnectExtension-warning-diffItem-row-content">{notebookValue ?? <i>undefined</i>}</div>
        </div>
      </div>
    </div>
  );
}
