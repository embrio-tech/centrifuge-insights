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
    const abortControllers: AbortController[] = []
    const loadMetadata = async () => {
      setLoading(true)
      await Promise.all(
        metadataPaths.map(async (path): Promise<void> => {
          const controller = new AbortController()
          abortControllers.push(controller)
          const { data: poolMetadata } = await ipfsClient.get<PoolMetadata>(path, { signal: controller.signal })
          setPoolsMetadata((oldPoolsMetadata) => ({ ...oldPoolsMetadata, [path]: poolMetadata }))
        })
      )
    }

    loadMetadata()
      .catch((error) => {
        setError(error)
      })
      .finally(() => {
        setLoading(false)
      })

    // effect cleanup
    return () => {
      abortControllers.forEach((controller) => {
        controller.abort()
      })
      setPoolsMetadata({})
    }
  }, [setError, metadataPaths])

  return { poolsMetadata, loading }
}
