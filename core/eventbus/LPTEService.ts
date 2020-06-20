import { ModuleType } from '../modules/Module';

export type LPTEventInput = {
  meta: {
    type: string,
    namespace: string,
    version: number,
    sender: {
      name: string,
      version: string,
      mode: ModuleType
    }
  }
}

export type LPTEvent = LPTEventInput & {
  meta: {
    sender: {
      name: string,
      version: string,
      mode: ModuleType
    }
  }
}

export interface LPTE {
  on(namespace: string, type: string, callback: (e: LPTEvent) => void): void;
  emit(e: LPTEventInput): void;
}