import { useEffect, useState } from "react";
import { Appointment } from "../../../model/Appointment";
import { toast } from "react-toastify";
import { appointmentApi } from "../../../service/appointmentApi";
import TableUI, { Column } from "../../../components/Table/TableUI";
import { Tag } from "antd";
import ModalDetail from "./components/ModalDetail";
import { formatVND } from "../../../utils/formatPrice";

const AppointmentManagement = () => {
  const [data, setData] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [render, setRender] = useState(false);
  const columns: Column[] = [
    {
      title: "id",
      dataIndex: "appointmentID",
      key: "id",
    },
    {
      title: "Appointment Day",
      dataIndex: "appointmentDate",
      key: "day",
    },
    {
      title: "Account ID",
      dataIndex: "accountID",
      key: "accountID",
    },
    {
      title: "stylist ID",
      dataIndex: "stylistID",
      key: "stylistID",
    },
    {
      title: "Status",
      dataIndex: "appointmentStatus",
      key: "appointmentStatus",
      render: (data) =>
        data === "CANCELLED" ? (
          <Tag color="red-inverse" className="text-base">Cancelled</Tag>
        ) : (
          <Tag color="green-inverse" className="text-base">Confirmed</Tag>
        ),
    },
    {
      title: "Appointment rice",
      dataIndex: "appointmentPrice",
      key: "appointmentPrice",
      render: (data) => <Tag color="orange-inverse" className="text-base">{formatVND(data)}</Tag>,
    },
    {
      title: "Action",
      dataIndex: "appointmentID",
      key: "Action",
      render: (data) => (
        <>
          <ModalDetail setRender={setRender} id={data} />
        </>
      ),
    },
  ];
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await appointmentApi.getAllAppointment();
        setData(response.body);
      } catch (error: any) {
        toast.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    if (render) {
      fetchData();
    }
  }, [render]);
  return (
    <div>
      <TableUI columns={columns} dataSource={data} loading={loading} />
    </div>
  );
};

export default AppointmentManagement;
