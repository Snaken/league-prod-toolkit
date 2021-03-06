import { LPTEvent, LPTEventInput } from '.'

export interface LPTE {
  /**
   * Subscribe for events and register a callback handler
   * @param namespace
   * @param type the event type. You may use * to listen to all events in the namespace
   * @param handler the event handler method
   */
  on: (namespace: string, type: string, handler: (e: LPTEvent) => void) => void

  /**
   * Clears out all event handler registrations for the symbolized namespace and type. Please note that if you pass * as type, it does not unregister all
   * types, but simply the listener that listens to all events.
   * @param namespace
   * @param type the event type
   */
  unregister: (namespace: string, type: string) => void

  /**
   * Emits an event to the event handler
   * @param e the event to emit
   */
  emit: (event: LPTEventInput) => void
}
