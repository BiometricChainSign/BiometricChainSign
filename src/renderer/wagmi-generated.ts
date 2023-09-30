import {
  getContract,
  GetContractArgs,
  readContract,
  ReadContractConfig,
  writeContract,
  WriteContractArgs,
  WriteContractPreparedArgs,
  WriteContractUnpreparedArgs,
  prepareWriteContract,
  PrepareWriteContractConfig,
} from 'wagmi/actions'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// mainnet
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const mainnetABI = [
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: '', internalType: 'string', type: 'string' }],
    name: 'docSignatures',
    outputs: [{ name: 'origDocHash', internalType: 'string', type: 'string' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: '_docHash', internalType: 'string', type: 'string' }],
    name: 'getDocumentSignatories',
    outputs: [{ name: '', internalType: 'address[]', type: 'address[]' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: '_address', internalType: 'address', type: 'address' }],
    name: 'getSignatoryCid',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: '_cid', internalType: 'string', type: 'string' }],
    name: 'setSignatoryCid',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: '_stampedDocHash', internalType: 'string', type: 'string' },
      { name: '_origDocHash', internalType: 'string', type: 'string' },
    ],
    name: 'signDocument',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'signatoryCids',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
  },
] as const

export const mainnetAddress = '0x7C6312A61Ab5645e53be42F154028D14B15B5c37' as const

export const mainnetConfig = { address: mainnetAddress, abi: mainnetABI } as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// sepolia
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const sepoliaABI = [
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: '', internalType: 'string', type: 'string' }],
    name: 'docSignatures',
    outputs: [{ name: 'origDocHash', internalType: 'string', type: 'string' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: '_docHash', internalType: 'string', type: 'string' }],
    name: 'getDocumentSignatories',
    outputs: [{ name: '', internalType: 'address[]', type: 'address[]' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: '_address', internalType: 'address', type: 'address' }],
    name: 'getSignatoryCid',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: '_cid', internalType: 'string', type: 'string' }],
    name: 'setSignatoryCid',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: '_stampedDocHash', internalType: 'string', type: 'string' },
      { name: '_origDocHash', internalType: 'string', type: 'string' },
    ],
    name: 'signDocument',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'signatoryCids',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
  },
] as const

export const sepoliaAddress = '0x7C6312A61Ab5645e53be42F154028D14B15B5c37' as const

export const sepoliaConfig = { address: sepoliaAddress, abi: sepoliaABI } as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Core
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link getContract}__ with `abi` set to __{@link mainnetABI}__.
 */
export function getMainnet(config: Omit<GetContractArgs, 'abi' | 'address'>) {
  return getContract({ abi: mainnetABI, address: mainnetAddress, ...config })
}

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link mainnetABI}__.
 */
export function readMainnet<TAbi extends readonly unknown[] = typeof mainnetABI, TFunctionName extends string = string>(
  config: Omit<ReadContractConfig<TAbi, TFunctionName>, 'abi' | 'address'>
) {
  return readContract({ abi: mainnetABI, address: mainnetAddress, ...config } as unknown as ReadContractConfig<
    TAbi,
    TFunctionName
  >)
}

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link mainnetABI}__.
 */
export function writeMainnet<TFunctionName extends string>(
  config:
    | Omit<WriteContractPreparedArgs<typeof mainnetABI, TFunctionName>, 'abi' | 'address'>
    | Omit<WriteContractUnpreparedArgs<typeof mainnetABI, TFunctionName>, 'abi' | 'address'>
) {
  return writeContract({ abi: mainnetABI, address: mainnetAddress, ...config } as unknown as WriteContractArgs<
    typeof mainnetABI,
    TFunctionName
  >)
}

/**
 * Wraps __{@link prepareWriteContract}__ with `abi` set to __{@link mainnetABI}__.
 */
export function prepareWriteMainnet<
  TAbi extends readonly unknown[] = typeof mainnetABI,
  TFunctionName extends string = string
>(config: Omit<PrepareWriteContractConfig<TAbi, TFunctionName>, 'abi' | 'address'>) {
  return prepareWriteContract({
    abi: mainnetABI,
    address: mainnetAddress,
    ...config,
  } as unknown as PrepareWriteContractConfig<TAbi, TFunctionName>)
}

/**
 * Wraps __{@link getContract}__ with `abi` set to __{@link sepoliaABI}__.
 */
export function getSepolia(config: Omit<GetContractArgs, 'abi' | 'address'>) {
  return getContract({ abi: sepoliaABI, address: sepoliaAddress, ...config })
}

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link sepoliaABI}__.
 */
export function readSepolia<TAbi extends readonly unknown[] = typeof sepoliaABI, TFunctionName extends string = string>(
  config: Omit<ReadContractConfig<TAbi, TFunctionName>, 'abi' | 'address'>
) {
  return readContract({ abi: sepoliaABI, address: sepoliaAddress, ...config } as unknown as ReadContractConfig<
    TAbi,
    TFunctionName
  >)
}

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link sepoliaABI}__.
 */
export function writeSepolia<TFunctionName extends string>(
  config:
    | Omit<WriteContractPreparedArgs<typeof sepoliaABI, TFunctionName>, 'abi' | 'address'>
    | Omit<WriteContractUnpreparedArgs<typeof sepoliaABI, TFunctionName>, 'abi' | 'address'>
) {
  return writeContract({ abi: sepoliaABI, address: sepoliaAddress, ...config } as unknown as WriteContractArgs<
    typeof sepoliaABI,
    TFunctionName
  >)
}

/**
 * Wraps __{@link prepareWriteContract}__ with `abi` set to __{@link sepoliaABI}__.
 */
export function prepareWriteSepolia<
  TAbi extends readonly unknown[] = typeof sepoliaABI,
  TFunctionName extends string = string
>(config: Omit<PrepareWriteContractConfig<TAbi, TFunctionName>, 'abi' | 'address'>) {
  return prepareWriteContract({
    abi: sepoliaABI,
    address: sepoliaAddress,
    ...config,
  } as unknown as PrepareWriteContractConfig<TAbi, TFunctionName>)
}
