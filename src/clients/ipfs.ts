import axios, { AxiosRequestConfig } from 'axios'
import { environment } from '../config'

const { IPFS_PROXY_URL } = environment

export const ipfsClient = axios.create({
  baseURL: IPFS_PROXY_URL,
})

ipfsClient.interceptors.request.use((config: AxiosRequestConfig) => {
  const { url } = config
  return { ...config, url: url?.replace('ipfs://ipfs/', '') }
})
