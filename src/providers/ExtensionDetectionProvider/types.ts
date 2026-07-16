export interface ExtensionStatus {
  detected: boolean;
  loading: boolean;
  error: Error | null;
}

export interface ExtensionDetector {
  strategy: string;
  detect: () => Promise<boolean>;
  timeout?: number;
}

export interface ExtensionDefinition {
  name: string;
  detectors: ExtensionDetector[];
}
