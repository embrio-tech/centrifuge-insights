import axios from 'axios'

export const ipfsClient = axios.create({
  baseURL: 'https://ipfs.io/ipfs/',
})
