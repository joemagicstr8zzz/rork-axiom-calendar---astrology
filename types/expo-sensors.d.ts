declare module 'expo-sensors' {
  export const DeviceMotion: {
    addListener: (cb: (data: any) => void) => { remove: () => void };
    setUpdateInterval: (ms: number) => void;
  } | undefined;
}
