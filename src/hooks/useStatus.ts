/**
 * useJupyterLabApp
 * A React hook that wraps useSWR to get the cluster connection state.
 */
import useSWR from 'swr';
import { SparkClusterStatus } from '../types';

export default function useStatus() {
  return useSWR<SparkClusterStatus>('/cluster/status');
}
