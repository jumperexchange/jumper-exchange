import { Instruction, MultichainSmartAccount } from '@biconomy/abstractjs';
import { Route } from '@lifi/sdk';
import { ProjectData } from 'src/types/questDetails';
import { AbiEntry, ZapDataResponse } from './zap.jumper-backend';

export interface SendCallsExtraParams {
  chainId: number | undefined;
  currentRoute: Route | null;
  zapData: ZapDataResponse;
  projectData: ProjectData;
  address: string | undefined;
}

export interface ValidatedSendCallsExtraParams extends SendCallsExtraParams {
  // This structure is what you can be sure of by the end of isValidParams.
  // Later we might want to implement runtime validation using something like zod
  // to simplify our code.
  chainId: number;
  currentRoute: Route;
  zapData: ZapDataResponse & {
    market: {
      address: `0x${string}`;
      depositToken: {
        address: `0x${string}`;
        decimals: number;
      };
    };
  };
  projectData: ProjectData;
  address: string;
}

export interface ZapExecutionContext extends ValidatedSendCallsExtraParams {
  getAbiAddress: (fct: AbiEntry) => `0x${string}`;
  getDepositAddress: () => `0x${string}`;
}

export interface ZapDefinition {
  commands: {
    [key: string]: ZapInstruction;
  };
  steps: string[];
}

export type ZapInstruction = (
  oNexus: MultichainSmartAccount,
  params: ZapExecutionContext,
) => Promise<Instruction[] | null>;
