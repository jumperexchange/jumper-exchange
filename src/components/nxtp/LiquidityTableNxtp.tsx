import { Table } from 'antd'
import { ColumnsType } from 'antd/lib/table'
import BigNumber from 'bignumber.js'

import { Chain } from '../../types'

const LiquidityTableNxtp = ({ liquidity }: any) => {
  const liquidityColumns: ColumnsType<any> = [
    {
      title: 'Chain',
      dataIndex: 'chain',
      key: 'chain',
      defaultSortOrder: 'descend',
      render: (chain: Chain) => {
        return chain.name
      },
      sorter: (a: any, b: any) => {
        return a.chain.name.localeCompare(b.chain.name)
      },
    },
    {
      title: 'USDC',
      dataIndex: 'USDC',
      key: 'USDC',
      align: 'right',
      render: (USDC: BigNumber) => {
        if (USDC.isZero()) {
          return ''
        }
        return USDC.shiftedBy(-3).toFixed(0) + ' 000'
      },
      sorter: (a: any, b: any) => {
        return a.USDC.minus(b.USDC).toNumber()
      },
    },
    {
      title: 'USDT',
      dataIndex: 'USDT',
      key: 'USDT',
      align: 'right',
      render: (USDT: BigNumber) => {
        if (USDT.isZero()) {
          return ''
        }
        return USDT.shiftedBy(-3).toFixed(0) + ' 000'
      },
      sorter: (a: any, b: any) => {
        return a.USDT.minus(b.USDT).toNumber()
      },
    },
    {
      title: 'DAI',
      dataIndex: 'DAI',
      key: 'DAI',
      align: 'right',
      render: (DAI: BigNumber) => {
        if (DAI.isZero()) {
          return ''
        }
        return DAI.shiftedBy(-3).toFixed(0) + ' 000'
      },
      sorter: (a: any, b: any) => {
        return a.DAI.minus(b.DAI).toNumber()
      },
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      align: 'right',
      render: (total: BigNumber) => {
        return total.shiftedBy(-3).toFixed(0) + ' 000'
      },
      sorter: (a: any, b: any) => {
        return a.total.minus(b.total).toNumber()
      },
    },
  ]

  return (
    <Table
      columns={liquidityColumns}
      dataSource={liquidity}
      style={{ whiteSpace: 'nowrap' }}
      pagination={false}
      sortDirections={['ascend', 'descend', 'ascend']}></Table>
  )
}

export default LiquidityTableNxtp
