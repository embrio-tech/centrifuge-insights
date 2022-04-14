import { production } from './production'
import { staging } from './staging'
import { development } from './development'
import { local } from './local'
import { defaults } from './defaults'
import dotenv from 'dotenv'
dotenv.config()

export const { REACT_APP_OPS_ENV = 'local' } = process.env

const getEnvironment = (opsEnv: string) => {
  if (opsEnv === 'local') {
    return { ...defaults, ...local }
  } else if (opsEnv === 'development') {
    return { ...defaults, ...development }
  } else if (opsEnv === 'staging') {
    return { ...defaults, ...staging }
  } else if (opsEnv === 'production') {
    return { ...defaults, ...production }
  }
  return defaults
}

export const environment = getEnvironment(REACT_APP_OPS_ENV)

// export { environment }
