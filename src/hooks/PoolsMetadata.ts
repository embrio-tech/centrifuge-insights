import { useEffect, useState } from 'react'
import { useError } from '../contexts'
import { PoolMetadata } from '../models'
import { ipfsClient } from '../clients'

interface PoolsMetadata {
  [path: string]: PoolMetadata
}

interface PoolsMetadataInterface {
  loading: boolean
  poolsMetadata: PoolsMetadata
}

/**
 * hook to fetch pool metadata for a list of metadata paths
 *
 * @prop {string[]} metadataPaths - list of metadatapaths
 *
 * @returns {object} - defined by PoolsMetadataInterface
 */
export const usePoolsMetadata = (metadataPaths: string[]): PoolsMetadataInterface => {
  const { setError } = useError()

  const [poolsMetadata, setPoolsMetadata] = useState<PoolsMetadata>({})
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    const loadMetadata = async () => {
      setLoading(true)
      const poolsMetadataList = await Promise.all(
        metadataPaths.map(
          async (path): Promise<[string, PoolMetadata]> => [
            path,
            (await ipfsClient.get<PoolMetadata>(path)).data
          ]
        )
      )
      setPoolsMetadata(Object.fromEntries(poolsMetadataList))
      setLoading(false)
    }

    loadMetadata().catch((error) => {
      setError(error)
    })
  }, [setError, metadataPaths])

  return { poolsMetadata, loading }
}
