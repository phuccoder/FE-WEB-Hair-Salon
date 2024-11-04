import {
  Button,
  Card,
  Descriptions,
  DescriptionsProps,
  Modal,
  Popconfirm,
  Rate,
  Tag,
} from "antd";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ButtonComponent from "../../../../components/Button/ButtonComponent";
import { Appointment } from "../../../../model/Appointment";
import { appointmentApi } from "../../../../service/appointmentApi";
import { formatVND } from "../../../../utils/formatPrice";
import { Stylist } from "../../../../model/Stylist";
import { Account } from "../../../../model/Account";
import { accountApi } from "../../../../service/accountApi";
import { stylistApi } from "../../../../service/stylistApi";
import { formatDate } from "../../../../utils/formatDate";

interface ModalDetailProp {
  id: number;
  setRender: any;
}

const ModalDetail = ({ id, setRender }: ModalDetailProp) => {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<Appointment>();
  const [stylist, setStylist] = useState<Stylist>();
  const [account, setAccount] = useState<Account>();
  const [loading, setLoading] = useState(false);
  const [ratingNumber, setRatingNumber] = useState(0);

  const items: DescriptionsProps["items"] = [
    {
      key: "1",
      label: "Appointment Date",
      children: data?.appointmentDate,
    },
    {
      key: "2",
      label: "Account",
      children: account?.accountName,
    },
    {
      key: "3",
      label: "Stylist",
      children: stylist?.stylistName,
    },
    {
      key: "4",
      label: "Appointment Price",
      children: (
        <p className="!text-orange-600">
          {formatVND(data?.appointmentPrice ? data.appointmentPrice : 0)}
        </p>
      ),
    },
    {
      key: "5",
      label: "Voucher",
      children: data?.voucherID ? data?.voucherID : "No Voucher",
    },
  ];

  useEffect(() => {
    const fetchData = async (appointmentId: number) => {
      try {
        setLoading(true);
        const response = await appointmentApi.getAppointmentById(appointmentId);
        const totalRating = response[0].reviews.reduce(
          (sum: number, review: any) => sum + review.reviewRating,
          0
        );
        const average = totalRating / response[0].reviews.length;
        setRatingNumber(average);
        setData(response[0]);
      } catch (error: any) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    if (id && open) {
      fetchData(id);
    }
  }, [id, open]);

  useEffect(() => {
    const fetchAccount = async (stylistID: number, accountID: number) => {
      try {
        const response = await accountApi.getAccountByID(accountID);
        const responseStylist = await stylistApi.getStylistByID(stylistID);
        setAccount(response.data);
        setStylist(responseStylist.data);
      } catch (error: any) {
        toast.error(error.message);
      }
    };
    if (data?.accountID && data.stylistID && open && data && id) {
      fetchAccount(data.stylistID, data.accountID);
    }
  }, [data, id, open]);

  const handleCancelAppointment = async (appointmentId: number) => {
    try {
      setLoading(true);
      await appointmentApi.cancelAppointment(appointmentId);
      setRender(true);
      toast.success("Cancel success");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setOpen(false);
  };
  return (
    <>
      <ButtonComponent onClick={() => setOpen(true)}>Detail</ButtonComponent>
      <Modal
        loading={loading}
        open={open}
        onCancel={handleCancel}
        title={"Detail"}
        width={1000}
        footer={[
          <Popconfirm
            key={"Cancel"}
            onConfirm={() => handleCancelAppointment(id)}
            title="Do you want to cancel this appointment"
          >
            <Button disabled={data?.appointmentStatus === "CANCELLED"} type="primary" danger>
              Cancel Appointment
            </Button>
          </Popconfirm>,
          <Button key={"Approve"} disabled={data?.appointmentStatus === "CONFIRMED"} type="primary" color="primary">
            Approve Appointment
          </Button>,
        ]}
      >
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-3">
            <p className="text-lg">Appointment Information: </p>
            <div className="">
              <Descriptions bordered items={items} column={2} />
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <p className="text-lg">Appointment Details: </p>
            <div className="grid grid-cols-3 gap-5">
              {data?.appointmentDetails.map((element) => (
                <Card hoverable className="shadow-xl">
                  <div className="flex flex-col gap-2">
                    <p>
                      Service:{"   "}
                      <Tag className="!text-base">
                        {element.serviceName} -{" "}
                        <span className="text-orange-600">
                          {formatVND(
                            element.servicePrice ? element.servicePrice : 0
                          )}
                        </span>
                      </Tag>
                    </p>
                    <p>
                      Combo:{"   "}
                      <Tag className="!text-base">
                        {element.comboName ? element.comboName : "Not choose"} -{" "}
                        <span className="text-orange-600">
                          {element.comboPrice
                            ? formatVND(element.comboPrice)
                            : formatVND(0)}
                        </span>{" "}
                      </Tag>
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
          <div className="flex flex-row gap-3">
            <p className="text-lg">Rating:</p>
            <div className="flex gap-3 items-center">
              <Rate value={ratingNumber} allowHalf disabled />{" "}
              <p className="text-base">({ratingNumber})</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-5">
            {data?.reviews.map((element) => (
              <Card hoverable>
                <div className="flex flex-col gap-5">
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2 items-center">
                      <Rate value={element.reviewRating} disabled allowHalf /> (
                      {element.reviewRating})
                    </div>
                    <p className="italic">{formatDate(element.reviewDate)}</p>
                  </div>
                  <div className="text-xs">
                    {element.comment.length < 300 ? element.comment : "..."}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ModalDetail;
