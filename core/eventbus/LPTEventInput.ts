export interface LPTEventInput {
  meta: {
    type: string
    namespace: string
    version: number
    /* sender: {
      name: string,
      version: string,
      mode: ModuleType
    } */
  }
  [key: string]: any
}
