import { LPTE, LPTEvent, LPTEventInput } from './LPTE';
import logger from '../logging'
import { Plugin, ModuleType } from '../modules/Module';

const log = logger('lpte-svc');

class Registration {
  type: string;
  namespace: string;
  handle: (event: LPTEvent) => void;

  constructor(namespace: string, type: string, handler: (event: LPTEvent) => void) {
    this.namespace = namespace;
    this.type = type;
    this.handle = handler;
  }
}

export class LPTEService implements LPTE {
  registrations: Array<Registration> = [];
  eventHistory: Array<LPTEvent> = [];

  initialize() {
    log.info('Initialized event bus.')
  }

  on(namespace: string, type: string, handler: (e: LPTEvent) => void): void {
    const registration = new Registration(namespace, type, handler);
    this.registrations.push(registration);

    log.info(`New event handler registered: namespace=${namespace}, type=${type}`);
  }

  unregister(namespace: string, type: string): void {
    this.registrations = this.registrations.filter(registration => registration.namespace !== namespace && registration.type !== type);
  }

  emit(event: LPTEvent): void {
    // Find matching handlers
    const handlers = this.registrations.filter(registration => registration.namespace === event.meta.namespace && registration.type === event.meta.type);

    handlers.forEach(handler => handler.handle(event));

    // Push to history
    this.eventHistory.push(event);
  }

  forPlugin(plugin: Plugin) {
    return {
      ...this,
      emit: (event: LPTEventInput): void => {
        // Enrich with sender information
        const enrichedEvent: LPTEvent = {
          ...event,
          meta: {
            ...event.meta,
            sender: {
              name: plugin.getModule().getName(),
              version: plugin.getModule().getVersion(),
              mode: ModuleType.PLUGIN
            }
          }
        }
        this.emit(enrichedEvent);
      }
    }
  }
}

const svc = new LPTEService();
export default svc;