import type { IpfsFile } from '../types'

export const getIpfsHash = (file?: string | IpfsFile): string | undefined => {
  if (typeof file === 'string') return file.replace('ipfs://ipfs/', '')
  return file?.uri
}
