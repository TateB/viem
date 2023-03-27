import { InvalidAddressError } from '../errors'
import type { Address } from '../types'
import { isAddress } from '../utils'
import type {
  AccountSource,
  CustomSource,
  JsonRpcAccount,
  LocalAccount,
} from './types'

type GetAccountReturnType<TAccountSource extends AccountSource> =
  | (TAccountSource extends Address ? JsonRpcAccount : never)
  | (TAccountSource extends CustomSource ? LocalAccount : never)

/**
 * @description Creates an Account from a custom signing implementation.
 *
 * @returns A Local Account.
 */
export function toAccount<TAccountSource extends AccountSource>(
  source: TAccountSource,
): GetAccountReturnType<TAccountSource> {
  if (typeof source === 'string') {
    if (!isAddress(source)) throw new InvalidAddressError({ address: source })
    return {
      address: source,
      type: 'json-rpc',
    } as GetAccountReturnType<TAccountSource>
  }

  if (!isAddress(source.address))
    throw new InvalidAddressError({ address: source.address })
  return {
    address: source.address,
    signMessage: source.signMessage,
    signTransaction: source.signTransaction,
    signTypedData: source.signTypedData,
    source: 'custom',
    type: 'local',
  } as GetAccountReturnType<TAccountSource>
}
