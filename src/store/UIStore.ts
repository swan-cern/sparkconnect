import { Store } from 'pullstate';
import { SparkCluster, SparkConfigBundle, SparkConfigOption } from '../types';

interface IUIStore {
  clusters: SparkCluster[];
  configBundleOptions: SparkConfigBundle[];
  configOptions: SparkConfigOption[];
  isConnecting: boolean;
  clusterName?: string;
}

export const UIStore = new Store<IUIStore>({
  clusters: [],
  configBundleOptions: [],
  configOptions: [],
  isConnecting: false
});
