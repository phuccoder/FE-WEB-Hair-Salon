import { Button, Image, Popconfirm, Tag } from "antd";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Column } from "../../../components/Table/TableComponent";
import TableUI from "../../../components/Table/TableUI";
import { Stylist } from "../../../model/Stylist";
import { stylistApi } from "../../../service/stylistApi";
import ModalAddStylist from "./components/ModalAddStylist";

const StylistManagement = () => {
  const [data, setData] = useState<Stylist[]>([]);
  const [loading, setLoading] = useState(false);
  const [render, setRender] = useState(false);
  const column: Column[] = [
    {
      title: "#",
      dataIndex: "stylistID",
      key: "id",
    },
    {
      title: "stylistAvatar",
      dataIndex: "stylistAvatar",
      key: "avatar",
      render: (data) => <Image src={data} width={150} height={150} />,
    },
    {
      title: "Name",
      dataIndex: "stylistName",
      key: "Name",
    },
    {
      title: "Phone",
      dataIndex: "stylistPhone",
      key: "Phone",
    },
    {
      title: "Email",
      dataIndex: "stylistEmail",
      key: "Email",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "Role",
    },
    {
      title: "Status",
      dataIndex: "stylistStatus",
      key: "Status",
      render: (status) =>
        status ? (
          <Tag color="green-inverse">Active</Tag>
        ) : (
          <Tag color="red-inverse">Inactive</Tag>
        ),
    },
    {
      title: "Action",
      dataIndex: "stylistID",
      key: "stylistID",
      render: (data: any, record: any) => (
        <div className="flex gap-2">
          <Popconfirm
            title={"Delete this combo"}
            okText="Yes"
            cancelText="No"
            onConfirm={() => handleDelete(data)}
          >
            <Button type="primary" danger>
              Delete
            </Button>
          </Popconfirm>
          <ModalAddStylist id={data} setRender={setRender} data={record} />
        </div>
      ),
    },
  ];
  const handleDelete = async (id: number) => {
    try {
      setLoading(true);
      await stylistApi.deleteStylist(id);
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
        const response = await stylistApi.getAllStylist();
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
      <ModalAddStylist setRender={setRender} />
      <TableUI loading={loading} columns={column} dataSource={data} />
    </>
  );
};

export default StylistManagement;
