export {}

enum Action {
  ADD_CLASS = 'ADD_CLASS',
  TEST_IMG = 'TEST_IMG',
}

type AddClassData = {
  modelFile: string
  classPath: string
}

type TestImgData = {
  modelFile: string
  testImagesPath: string[]
}

type Argv = { action: keyof typeof Action; data: AddClassData | TestImgData }

declare global {
  interface Window {
    electron: {
      /**
       * @example
       * // data.modelFile person.xml
       * // data.classPath path to face imgs dataset/new_class/person -> "dataset/new_class/"
       */
      runScript: <T>(argv: Argv) => Promise<T>

      storeFaceImage: (address: string, fileName: string, imageFile: Buffer) => Promise<void>

      setWeb3StorageToken: (token: string) => Promise<void>

      uploadModelToFilecoin: (address: string) => Promise<string>

      downloadModelFromFilecoin: (cid: string, address: string) => Promise<void>

      cleanupModelFiles: (address: string) => Promise<void>
    }
  }
}
