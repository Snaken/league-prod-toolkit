import { LPTE, LPTEvent, LPTEventInput, EventType } from './LPTE';
import logger from '../logging'
import { Plugin, ModuleType } from '../modules/Module';
import { wsClients } from '../web/server';

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
  counter: number = 0;

  constructor() {
    this.await = this.await.bind(this);
  }

  initialize() {
    log.info('Initialized event bus.')
  }

  on(namespace: string, type: string, handler: (e: LPTEvent) => void): void {
    const registration = new Registration(namespace, type, handler);
    this.registrations.push(registration);

    log.debug(`New event handler registered: namespace=${namespace}, type=${type}`);
  }

  async request(event: LPTEvent, timeout: number = 1000): Promise<LPTEvent> {
    const reply = event.meta.type + "-" + this.counter++;
    event.meta.reply = reply;
    event.meta.channelType = EventType.REQUEST;

    this.emit(event);

    try {
      return await this.await('reply', reply, timeout);
    } catch {
      log.error(`Request timed out. Request meta=${JSON.stringify(event.meta)}`);
      return null;
    }
  }

  async await(namespace: string, type: string, timeout: number = 1000): Promise<LPTEvent> {
    return new Promise((resolve, reject) => {
      let wasHandled = false;

      const handler = (e: LPTEvent) => {
        if (wasHandled) {
          return;
        }
        wasHandled = true;
        this.unregisterHandler(handler);

        resolve(e);
      }
      // Register handler
      this.on(namespace, type, handler);

      setTimeout(() => {
        if (wasHandled) {
          return;
        }
        wasHandled = true;
        this.unregisterHandler(handler);

        log.warn(`Awaiting event timed out. namespace=${namespace}, type=${type}, timeout=${timeout}`);
        reject('request timed out');
      }, timeout);
    });
  }

  unregister(namespace: string, type: string): void {
    this.registrations = this.registrations.filter(registration => registration.namespace !== namespace && registration.type !== type);
  }

  unregisterHandler(handler: (event: LPTEvent) => void) {
    this.registrations = this.registrations.filter(registration => registration.handle !== handler);
  }

  emit(event: LPTEvent): void {
    setTimeout(() => {
      // Find matching handlers
      const handlers = this.registrations.filter(registration => registration.namespace === event.meta.namespace && registration.type === event.meta.type);
      handlers.forEach(handler => handler.handle(event));

      if (handlers.length === 0 && event.meta.channelType === EventType.REQUEST) {
        log.warn(`Request was sent, but no handler was executed. This will result in a timeout. Meta=${JSON.stringify(event.meta)}`);
      }

      // Push to websockets (currently only for logs)
      if (event.meta.namespace === 'log') {
        wsClients.forEach(socket => {
          socket.send(JSON.stringify(event));
        });
      }

      // Push to history
      this.eventHistory.push(event);
    }, 0);
  }

  forPlugin(plugin: Plugin) {
    const enrichEvent = (event: LPTEventInput): LPTEvent => {
      return {
        ...event,
        meta: {
          channelType: EventType.BROADCAST,
          ...event.meta,
          sender: {
            name: plugin.getModule().getName(),
            version: plugin.getModule().getVersion(),
            mode: ModuleType.PLUGIN,
            path: plugin.getModule().getFolder()
          }
        }
      };
    }

    return {
      ...this,
      emit: (event: LPTEventInput): void => {
        // Enrich with sender information
        this.emit(enrichEvent(event));
      },
      on: this.on,
      request: (event: LPTEventInput): Promise<LPTEvent> => {
        // Enrich with sender information
        return this.request(enrichEvent(event));
      },
      await: this.await
    }
  }
}

const svc = new LPTEService();
export default svc;