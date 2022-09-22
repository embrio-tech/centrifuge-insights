import { Select, Tag } from 'antd'
import type { CustomTagProps } from 'rc-select/lib/BaseSelect'
import React, { useCallback, useEffect, useMemo } from 'react'
import { useFilters, usePool } from '../../../../contexts'
import { FilterLabel } from '../util'
// import './TrancheFilter.less'

interface TrancheFilterProps {
  className?: string
  id: string
}

export const TrancheFilter: React.FC<TrancheFilterProps> = (props) => {
  const { className, id } = props
  const { poolMetadata, loading: metadataLoading } = usePool()
  const { setSelection, selection, setFilterStatus, filterReady } = useFilters(id)

  // get tranches from poolMetadata
  const tranches = useMemo(() => poolMetadata?.tranches || {}, [poolMetadata])

  // derive filters selection options from tranches
  const options = useMemo<{ label: string; value: string }[]>(() => {
    return [
      {
        label: 'All tranches',
        value: 'all',
      },
      ...Object.entries(tranches).map(([trancheId, trancheMetadata]) => ({
        label: `${trancheMetadata.name} (${trancheMetadata.symbol})`,
        value: trancheId,
      })),
    ]
  }, [tranches])

  // onChange: store new selection to FiltersContext
  const onChange = (value: string[]) => {
    if (value[0] === 'all' && value.length > 1) {
      // if all tranches were selected and user selects one tranche
      // store only the newly selected tranche as selection
      setSelection(
        id,
        value.filter((item) => item !== 'all')
      )
    } else if (value[value.length - 1] === 'all') {
      // if an arbitrary amount of tranches are selected and user selects all
      // store all options as selection
      setSelection(
        id,
        options.map(({ value }) => value).filter((value) => value !== 'all')
      )
    } else {
      // store selected tranches as selection
      setSelection(id, [...value])
    }
  }

  // read selected option from FiltersContext
  const selected = useMemo(
    () => (selection?.length === options.length - 1 ? ['all'] : selection || []),
    [selection, options]
  )

  // effect to select all tranches initially
  useEffect(() => {
    // if filter id is known and tranche options are loaded
    if (id && options.length - 1) {
      // if select has nothing selected or if one of the current selections are not a valid option
      if (!selected.length || !selection?.every((item) => options.map(({ value }) => value).includes(item))) {
        // select all options
        setFilterStatus(id, false)
        setSelection(
          id,
          options.map(({ value }) => value).filter((value) => value !== 'all')
        )
      }

      // if filter has id and options but is still not ready, set filter to ready
      if (!filterReady) setFilterStatus(id, true)
    }
  }, [id, options, setFilterStatus, selected, filterReady, setSelection, selection])

  // tag renderer
  const tagRender = useCallback((props: CustomTagProps) => {
    const { onClose, value, label } = props
    const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
      event.preventDefault()
      event.stopPropagation()
    }
    return (
      <Tag
        onMouseDown={onPreventMouseDown}
        closable={value === 'all' ? false : true}
        onClose={onClose}
        className='pl-2 my-0.5 mr-1 bg-neutral-100 border-neutral-200 cursor-default'
        style={{ fontSize: '14px', lineHeight: '22px', paddingRight: value === 'all' ? '0.5rem' : '0.25rem' }}
      >
        {label}
      </Tag>
    )
  }, [])

  return (
    <FilterLabel className={className} label='Tranches'>
      <Select
        mode='multiple'
        value={selected}
        options={options}
        className='w-full'
        loading={metadataLoading}
        onChange={onChange}
        showArrow={true}
        showSearch={false}
        tagRender={tagRender}
      />
    </FilterLabel>
  )
}
