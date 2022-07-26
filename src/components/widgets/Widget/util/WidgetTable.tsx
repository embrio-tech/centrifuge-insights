import React from 'react'
import type { ReactElement, ReactNode } from 'react'
import './WidgetTable.less'
import { Pagination } from 'antd'
import type { PaginationProps } from 'antd'

interface ColumnType<DataType> {
  title?: string
  dataIndex: string
  key?: string
  align?: 'left' | 'center' | 'right'
  render?: (value: string | number | undefined, record: DataType, index: number) => ReactNode
}

export type ColumnsType<DataType> = ColumnType<DataType>[]

interface WidgetTableProps<DataType = Record<string, unknown>> {
  className?: string
  dataSource: DataType[]
  columns: ColumnType<DataType>[]
  pagination?: PaginationProps
  rowKey?: (record: DataType) => string
}

export type TableData = Record<string, string | number | undefined>

export const WidgetTable = <DataType extends TableData>(
  props: WidgetTableProps<DataType>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): ReactElement<any, any> | null => {
  const { className, dataSource, columns, rowKey, pagination } = props

  const getColumnClassName = (align?: 'left' | 'center' | 'right'): string => {
    const classNames = ['column']
    if (align) classNames.push(align)
    return classNames.join(' ')
  }

  return (
    // columns
    <div className={className}>
      <div className='widget-table'>
        {columns.map(({ title, key, dataIndex, render, align }, colIndex) => (
          <div className={getColumnClassName(align)} key={key || colIndex}>
            {/* header row */}
            <div className='row header'>{title || '\u00A0'}</div>
            {/* rows */}
            {dataSource.map((record, rowIndex) => (
              <div className='row' key={rowKey ? rowKey(record) : `${colIndex}-${rowIndex}`}>
                {render ? render(record[dataIndex], record, rowIndex) : record[dataIndex] || '\u00A0'}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className='text-right mt-4'>
        <Pagination {...pagination} />
      </div>
    </div>
  )
}
