import { Table } from "antd";
import { ColumnsType } from "antd/lib/table";

const LiquidityTableNxtp = () => {
  const liquidityColumns: ColumnsType<any> = [
    {
      title: "Chain",
    },
    {
      title: "Asset",
    },
    {
      title: "Exit Liquidity",
    },
  ];

  return (
    <Table
      columns={liquidityColumns}
      dataSource={[]}
      style={{ whiteSpace: "nowrap" }}
      pagination={{ position: ["bottomCenter"] }}
      sortDirections={["ascend", "descend", "ascend"]}
    ></Table>
  );
};

export default LiquidityTableNxtp;
