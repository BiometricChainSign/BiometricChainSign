import { readMainnet, readSepolia, writeMainnet, writeSepolia } from './wagmi-generated'

type ContractMethods = {
  read: typeof readSepolia | typeof readMainnet
  write: typeof writeSepolia | typeof writeMainnet
}

export const contract: ContractMethods = {
  read: readMainnet,
  write: writeMainnet,
}
