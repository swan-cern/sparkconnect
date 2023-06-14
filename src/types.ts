export enum ExtensionState {
  CONFIGURING = 'CONFIGURING',
  PROVISIONING = 'PROVISIONING',
  READY = 'READY',
  ERROR = 'ERROR'
}

export interface SparkCluster {
  name: string;
  displayName: string;
}

export interface SparkConfigBundle {
  name: string;
  displayName: string;
  options: Array<{
    name: string;
    value: string;
    concatenate?: string;
  }>;
  clusterFilter?: string[];
}

export interface SparkConfigOption {
  category?: string;
  name: string;
}
