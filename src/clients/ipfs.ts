import axios, { AxiosRequestConfig } from 'axios'

export const ipfsClient = axios.create({
  baseURL: 'https://ipfs.io/ipfs/',
})

ipfsClient.interceptors.request.use((config: AxiosRequestConfig) => {
  const { url } = config
  return { ...config, url: url?.replace('ipfs://ipfs/', '') }
})
