import { Button, Popconfirm, Tag } from "antd";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Column } from "../../../components/Table/TableComponent";
import TableUI from "../../../components/Table/TableUI";
import { Account } from "../../../model/Account";
import { accountApi } from "../../../service/accountApi";
import ModalAddAccount from "./components/ModalAddAccount";

const UserManagement = () => {
  const [data, setData] = useState<Account[]>([]);
  const [loading, setLoading] = useState(false);
  const [render, setRender] = useState(false);
  const column: Column[] = [
    {
      title: "#",
      dataIndex: "accountID",
      key: "id",
    },
    {
      title: "Name",
      dataIndex: "accountName",
      key: "Name",
    },
    {
      title: "Phone",
      dataIndex: "accountPhone",
      key: "Phone",
    },
    {
      title: "Email",
      dataIndex: "accountEmail",
      key: "Email",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "Role",
    },
    {
      title: "Status",
      dataIndex: "accountStatus",
      key: "Status",
      render: (data) =>
        data ? (
          <Tag color="green-inverse">Verfied</Tag>
        ) : (
          <Tag color="red-inverese">Not verifed</Tag>
        ),
    },
    {
      title: "Action",
      dataIndex: "accountID",
      key: "accountID",
      render: (data: any) => (
        <div className="flex gap-2">
          <Popconfirm
            title={"Delete this account"}
            okText="Yes"
            cancelText="No"
            onConfirm={() => handleDelete(data)}
          >
            <Button type="primary" danger>
              Delete
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];
  const handleDelete = async (id: number) => {
    try {
      setLoading(true);
      await accountApi.deleteAccount(id);
      toast.success("Delete success");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
      setRender(true);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await accountApi.getAll();
        setData(response.data);
      } catch (error: any) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    if (render) {
      fetchData();
      setRender(false);
    }
  }, [render]);
  return (
    <>
      <ModalAddAccount setRender={setRender} />
      <TableUI className="mt-5" loading={loading} columns={column} dataSource={data && data} />
    </>
  );
};

export default UserManagement;
