export {}

declare global {
  interface Window {
    electron: {
      runPythonScript: <T>(argv: { [key: string]: unknown }) => Promise<T>
    }
  }
}
