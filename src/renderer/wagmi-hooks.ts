import {
  useContractRead,
  UseContractReadConfig,
  useContractWrite,
  UseContractWriteConfig,
  usePrepareContractWrite,
  UsePrepareContractWriteConfig,
} from 'wagmi'
import { ReadContractResult, WriteContractMode, PrepareWriteContractResult } from 'wagmi/actions'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const ABI = [
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

export const Address = '0x88E825cD5720991B9aEEdcaa16C2f2ac373B2243' as const

export const Config = { address: Address, abi: ABI } as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link ABI}__.
 */
export function useRead<TFunctionName extends string, TSelectData = ReadContractResult<typeof ABI, TFunctionName>>(
  config: Omit<UseContractReadConfig<typeof ABI, TFunctionName, TSelectData>, 'abi' | 'address'> = {} as any
) {
  return useContractRead({ abi: ABI, address: Address, ...config } as UseContractReadConfig<
    typeof ABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link ABI}__ and `functionName` set to `"docSignatures"`.
 */
export function useDocSignatures<
  TFunctionName extends 'docSignatures',
  TSelectData = ReadContractResult<typeof ABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof ABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > = {} as any
) {
  return useContractRead({
    abi: ABI,
    address: Address,
    functionName: 'docSignatures',
    ...config,
  } as UseContractReadConfig<typeof ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link ABI}__ and `functionName` set to `"getDocumentSignatories"`.
 */
export function useGetDocumentSignatories<
  TFunctionName extends 'getDocumentSignatories',
  TSelectData = ReadContractResult<typeof ABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof ABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > = {} as any
) {
  return useContractRead({
    abi: ABI,
    address: Address,
    functionName: 'getDocumentSignatories',
    ...config,
  } as UseContractReadConfig<typeof ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link ABI}__ and `functionName` set to `"getSignatoryCid"`.
 */
export function useGetSignatoryCid<
  TFunctionName extends 'getSignatoryCid',
  TSelectData = ReadContractResult<typeof ABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof ABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > = {} as any
) {
  return useContractRead({
    abi: ABI,
    address: Address,
    functionName: 'getSignatoryCid',
    ...config,
  } as UseContractReadConfig<typeof ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link ABI}__ and `functionName` set to `"signatoryCids"`.
 */
export function useSignatoryCids<
  TFunctionName extends 'signatoryCids',
  TSelectData = ReadContractResult<typeof ABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof ABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > = {} as any
) {
  return useContractRead({
    abi: ABI,
    address: Address,
    functionName: 'signatoryCids',
    ...config,
  } as UseContractReadConfig<typeof ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link ABI}__.
 */
export function useWrite<TFunctionName extends string, TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<PrepareWriteContractResult<typeof ABI, string>['request']['abi'], TFunctionName, TMode>
    : UseContractWriteConfig<typeof ABI, TFunctionName, TMode> & {
        abi?: never
      } = {} as any
) {
  return useContractWrite<typeof ABI, TFunctionName, TMode>({ abi: ABI, address: Address, ...config } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link ABI}__ and `functionName` set to `"setSignatoryCid"`.
 */
export function useSetSignatoryCid<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof ABI, 'setSignatoryCid'>['request']['abi'],
        'setSignatoryCid',
        TMode
      > & { functionName?: 'setSignatoryCid' }
    : UseContractWriteConfig<typeof ABI, 'setSignatoryCid', TMode> & {
        abi?: never
        functionName?: 'setSignatoryCid'
      } = {} as any
) {
  return useContractWrite<typeof ABI, 'setSignatoryCid', TMode>({
    abi: ABI,
    address: Address,
    functionName: 'setSignatoryCid',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link ABI}__ and `functionName` set to `"signDocument"`.
 */
export function useSignDocument<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof ABI, 'signDocument'>['request']['abi'],
        'signDocument',
        TMode
      > & { functionName?: 'signDocument' }
    : UseContractWriteConfig<typeof ABI, 'signDocument', TMode> & {
        abi?: never
        functionName?: 'signDocument'
      } = {} as any
) {
  return useContractWrite<typeof ABI, 'signDocument', TMode>({
    abi: ABI,
    address: Address,
    functionName: 'signDocument',
    ...config,
  } as any)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link ABI}__.
 */
export function usePrepareWrite<TFunctionName extends string>(
  config: Omit<UsePrepareContractWriteConfig<typeof ABI, TFunctionName>, 'abi' | 'address'> = {} as any
) {
  return usePrepareContractWrite({ abi: ABI, address: Address, ...config } as UsePrepareContractWriteConfig<
    typeof ABI,
    TFunctionName
  >)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link ABI}__ and `functionName` set to `"setSignatoryCid"`.
 */
export function usePrepareSetSignatoryCid(
  config: Omit<
    UsePrepareContractWriteConfig<typeof ABI, 'setSignatoryCid'>,
    'abi' | 'address' | 'functionName'
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: ABI,
    address: Address,
    functionName: 'setSignatoryCid',
    ...config,
  } as UsePrepareContractWriteConfig<typeof ABI, 'setSignatoryCid'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link ABI}__ and `functionName` set to `"signDocument"`.
 */
export function usePrepareSignDocument(
  config: Omit<
    UsePrepareContractWriteConfig<typeof ABI, 'signDocument'>,
    'abi' | 'address' | 'functionName'
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: ABI,
    address: Address,
    functionName: 'signDocument',
    ...config,
  } as UsePrepareContractWriteConfig<typeof ABI, 'signDocument'>)
}
