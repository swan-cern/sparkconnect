/**
 * useCluster
 * A React hook to get the connected cluster data.
 */
import { UIStore } from '../store/UIStore';

export default function useCluster() {
  const clusterName = UIStore.useState(s => s.clusterName);
  const clusters = UIStore.useState(s => s.clusters);
  const cluster = clusters.find(c => c.name === clusterName);
  return cluster;
}
