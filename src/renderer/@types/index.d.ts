export {}

declare global {
  interface Window {
    electron: {
      runPythonScript: <T>(argv: string[]) => Promise<T>
    }
  }
}
