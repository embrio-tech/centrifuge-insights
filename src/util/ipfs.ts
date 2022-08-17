import type { IpfsFile } from '../types'

export const getIpfsHash = (file?: string | IpfsFile): string => {
  if (typeof file === 'string') return file.replace('ipfs://ipfs/', '')
  return file?.ipfsHash || ''
}
