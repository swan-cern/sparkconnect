import { Store } from 'pullstate';
import { NotebookPanel } from '@jupyterlab/notebook';
import { SparkCluster, SparkConfigBundle, SparkConfigOption } from '../types';

interface IUIStore {
  clusters: SparkCluster[];
  configBundleOptions: SparkConfigBundle[];
  configOptions: SparkConfigOption[];
  isConnecting: boolean;
  isConnectionFailed: boolean;
  clusterName?: string;
  activeNotebookPanel: NotebookPanel | null;
}

export const UIStore = new Store<IUIStore>({
  clusters: [],
  configBundleOptions: [],
  configOptions: [],
  isConnecting: false,
  isConnectionFailed: false,
  activeNotebookPanel: null
});
