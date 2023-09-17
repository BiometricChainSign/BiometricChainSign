export {}

enum Action {
  ADD_CLASS = 'ADD_CLASS',
  TEST_IMG = 'TEST_IMG',
}

declare global {
  interface Window {
    electron: {
      runPythonScript: <T>(argv: { action: keyof typeof Action; data: any }) => Promise<T>
    }
  }
}
