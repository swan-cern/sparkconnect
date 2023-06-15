import useSWR from 'swr';

export default function useStatus() {
  return useSWR('/cluster/status');
}
