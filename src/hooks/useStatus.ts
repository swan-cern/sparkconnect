import useSWR from 'swr';
import { SparkClusterStatus } from '../types';

export default function useStatus() {
  return useSWR<SparkClusterStatus>('/cluster/status');
}
