import axios from 'axios'

export const publicClient = axios.create({
  baseURL: '/',
})
