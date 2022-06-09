import { useEffect, useState } from 'react'
import { useError } from '../contexts'
import { PoolMetadata } from '../models'

interface PoolsMetadata {
  [path: string]: PoolMetadata
}

export const usePoolsMetadata = (metadataPaths: string[]): PoolsMetadata => {
  const { setError } = useError()

  const [poolsMetadata, setPoolsMetadata] = useState<PoolsMetadata>({})

  useEffect(() => {
    const loadMetadata = async () => {
      const poolsMetadataList = await Promise.all(
        metadataPaths.map(
          async (path): Promise<[string, PoolMetadata]> => [
            path,
            (await (await fetch(`https://ipfs.io/ipfs/${path}`)).json()) as PoolMetadata,
          ]
        )
      )
      setPoolsMetadata(Object.fromEntries(poolsMetadataList))
    }

    loadMetadata().catch((error) => {
      setError(error)
    })
  }, [setError, metadataPaths])

  return poolsMetadata
}
