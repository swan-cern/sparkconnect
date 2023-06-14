import { Store } from 'pullstate';
import { SparkCluster, SparkConfigBundle } from '../types';

interface IUIStore {
  clusters: SparkCluster[];
  configBundleOptions: SparkConfigBundle[];
}

export const UIStore = new Store<IUIStore>({
  clusters: [],
  configBundleOptions: []
});
