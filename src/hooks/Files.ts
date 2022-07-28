import { useEffect, useState } from 'react'
import { ipfsClient } from '../clients'
import { useError } from '../contexts'

interface FilesUrls {
  [hash: string]: string
}

interface FilesInterface {
  loading: boolean
  filesUrls: FilesUrls
}

/**
 * hook to fetch files from ipfs by ipfs hash
 *
 * @prop {string[]} hashes - list of file hashes `string[]`
 *
 * @returns {FilesInterface} object containing `filesUrls` and `loading` indicator
 */
export const useFiles = (hashes: string[]): FilesInterface => {
  const { setError } = useError()

  const [filesUrls, setFilesUrls] = useState<FilesUrls>({})
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    const urls: string[] = []
    const abortControllers: AbortController[] = []
    const leadFiles = async () => {
      setLoading(true)

      await Promise.all(
        hashes.map(async (hash): Promise<void> => {
          if (!hash) throw new Error('File hash undefined!')
          const headers = { Accept: '*/*' }
          const controller = new AbortController()
          abortControllers.push(controller)
          const { data: file, headers: responseHeaders } = await ipfsClient.get<Blob>(hash, {
            signal: controller.signal,
            headers,
            responseType: 'blob',
          })
          const blob = new Blob([file], { type: responseHeaders['content-type'] })
          const url = URL.createObjectURL(blob)
          urls.push(url)
          setFilesUrls((oldFilesUrls) => ({ ...oldFilesUrls, [hash]: url }))
        })
      )
    }

    leadFiles()
      .catch((error) => {
        setError(error)
      })
      .finally(() => {
        setLoading(false)
      })

    // effect cleanup
    return () => {
      urls.forEach((url) => {
        URL.revokeObjectURL(url)
      })
      abortControllers.forEach((controller) => {
        controller.abort()
      })
      setFilesUrls({})
    }
  }, [setError, hashes])

  return { loading, filesUrls }
}
