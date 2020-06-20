import { LPTE, LPTEventInput, LPTEvent } from './LPTEService';

class Registration {
  type: string;
  namespace: string;

  constructor(namespace: string, type: string, callback: (e: LPTEvent) => void) {
    this.namespace = namespace;
    this.type = type;
  }
}

export class LPTELocal implements LPTE {
  registrations: Array<Registration> = [];

  on(namespace: string, type: string, callback: (e: LPTEvent) => void): void {
    const registration = new Registration(namespace, type, callback);
    this.registrations.push(registration);
  }
  emit(e: LPTEventInput): void {
    throw new Error("Method not implemented.");
  }

}