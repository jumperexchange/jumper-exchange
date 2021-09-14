import { Table } from "antd";
import { ColumnsType } from "antd/lib/table";

const LiquidityTableNxtp = ({ liquidity }: any) => {
  const liquidityColumns: ColumnsType<any> = [
    {
      title: "Chain",
      dataIndex: "chain",
      key: "chain",
    },
    {
      title: "Asset",
      dataIndex: "asset",
      key: "asset",
    },
    {
      title: "Exit Liquidity",
      dataIndex: "liquidity",
      key: "liquidity",
    },
  ];

  return (
    <Table
      columns={liquidityColumns}
      dataSource={liquidity}
      style={{ whiteSpace: "nowrap" }}
      pagination={{ position: ["bottomCenter"] }}
      sortDirections={["ascend", "descend", "ascend"]}
    ></Table>
  );
};

export default LiquidityTableNxtp;
