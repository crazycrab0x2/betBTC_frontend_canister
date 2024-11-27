// src/pinia-plugin-persist.d.ts
declare module 'pinia-plugin-persist' {
  import { PiniaPluginContext } from 'pinia'

  interface PersistOptions {
    // Define the shape of your options here
  }

  const piniaPluginPersist: (context: PiniaPluginContext) => void
  export default piniaPluginPersist
}
