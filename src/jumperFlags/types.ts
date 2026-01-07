export type AccessStatus = 'BLOCKED' | 'ALLOWED';

export interface JumperFlags {
  access: AccessStatus;
  hasEarn: boolean;
}

export interface JumperFlagsContextValue {
  flags: JumperFlags | null;
  isLoading: boolean;
  error: Error | null;
}

export type BouncerStatus = 'loading' | 'blocked' | 'allowed';
