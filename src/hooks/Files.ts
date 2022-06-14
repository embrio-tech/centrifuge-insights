import { useEffect, useState } from 'react'
import { ipfsClient } from '../clients'
import { useError } from '../contexts'

interface FilesUrls {
  [path: string]: string
}

interface FileMetaInterface {
  path: string // ipfs path
  mime: string // mime type
}

interface FilesInterface {
  loading: boolean
  filesUrls: FilesUrls
}

/**
 * hook to fetch files from ipfs
 *
 * @prop {FileMetaInterface[]} files - list of files `{ path: string; mime: string }[]`
 *
 * @returns {FilesInterface} object containing `filesUrls` and `loading` indicator
 */
export const useFiles = (files: FileMetaInterface[]): FilesInterface => {
  const { setError } = useError()

  const [filesUrls, setFilesUrls] = useState<FilesUrls>({})
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    const urls: string[] = []
    const abortControllers: AbortController[] = []
    const leadFiles = async () => {
      setLoading(true)

      await Promise.all(
        files.map(async ({ path, mime }): Promise<void> => {
          const headers = { Accept: mime }
          const controller = new AbortController()
          abortControllers.push(controller)
          const { data: file } = await ipfsClient.get<Blob>(path, {
            signal: controller.signal,
            headers,
            responseType: 'blob',
          })
          const blob = new Blob([file], { type: mime })
          const url = URL.createObjectURL(blob)
          urls.push(url)
          setFilesUrls((oldFilesUrls) => ({ ...oldFilesUrls, [path]: url }))
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
  }, [setError, files])

  return { loading, filesUrls }
}
