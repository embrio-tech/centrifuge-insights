import React, { createContext, PropsWithChildren, useContext, useMemo } from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { publicClient } from '../clients'
import * as tenants from '../config/tenant'
import { useError } from '../contexts'
import { useQuery } from '../hooks'
import { TenantConfig } from '../types'

interface TenantContextInterface {
  tenantId?: string
  tenantConfig: TenantConfig
  loading: boolean
}

const TenantContext = createContext<TenantContextInterface | undefined>(undefined)

const TenantContextProvider: React.FC<PropsWithChildren> = (props) => {
  const { children } = props
  const { setError } = useError()
  const [params] = useQuery()
  const [tenantId, setTenantId] = useState<string | undefined>(undefined)
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    const abortControllers: AbortController[] = []

    const loadTenantId = async () => {
      setLoading(true)

      if (params.tenantId && typeof params.tenantId === 'string') {
        setTenantId(params.tenantId)
      } else {
        const controller = new AbortController()
        abortControllers.push(controller)

        const {
          data: { TENANT_ID: tenantId },
        } = await publicClient.get<{ TENANT_ID: string }>('tenant.json', {
          signal: controller.signal,
        })
        setTenantId(tenantId)
      }
    }

    loadTenantId()
      .catch((error) => {
        if (error.response?.status === 404) {
          console.warn(
            // eslint-disable-next-line max-len
            'WARNING ::: No tenantId specified, using default config! Either specify it as query param tenantId or in a static file tenant.json.'
          )
        } else {
          setError(error)
        }
      })
      .finally(() => {
        setLoading(false)
      })

    // effect cleanup
    return () => {
      abortControllers.forEach((controller) => {
        controller.abort()
      })
    }
  }, [setError, params])

  const tenantConfig = useMemo(() => {
    if (tenantId && tenants[tenantId as keyof typeof tenants])
      return { ...tenants.defaults, ...tenants[tenantId as keyof typeof tenants] }
    return { ...tenants.defaults }
  }, [tenantId])

  const value = useMemo<TenantContextInterface>(
    () => ({
      tenantId,
      tenantConfig,
      loading,
    }),
    [tenantId, loading, tenantConfig]
  )

  return <TenantContext.Provider value={value}>{children}</TenantContext.Provider>
}

const useTenant = (): TenantContextInterface => {
  const context = useContext(TenantContext)
  if (!context) {
    throw new Error('useTenant must be inside a Provider with a value')
  }
  return context
}

export { TenantContextProvider, useTenant }
