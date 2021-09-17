import { Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import BigNumber from 'bignumber.js';
import { Chain, Token } from '../../types';

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
      title: 'Exit Liquidity',
      dataIndex: 'liquidity',
      key: 'liquidity',
      align: 'right',
      render: (amount: BigNumber) => {
        return amount.toFixed(2)
      },
      sorter: (a: any, b: any) => {
        return a.liquidity.minus(b.liquidity).toNumber()
      },
    },
    {
      title: 'Asset',
      dataIndex: 'asset',
      key: 'asset',
      render: (asset: Token) => {
        return asset.name
      },
      sorter: (a: any, b: any) => {
        return a.asset.name.localeCompare(b.asset.name)
      },
    },
  ]

  return (
    <Table
      columns={liquidityColumns}
      dataSource={liquidity}
      style={{ whiteSpace: 'nowrap' }}
      pagination={{ position: ['bottomCenter'] }}
      sortDirections={['ascend', 'descend', 'ascend']}
    ></Table>
  )
}

export default LiquidityTableNxtp
