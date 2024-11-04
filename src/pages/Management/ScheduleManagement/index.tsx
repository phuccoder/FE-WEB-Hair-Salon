import { Calendar, Popover, Tag } from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { RootState } from "../../../core/store/store";
import { scheduleApi } from "../../../service/scheduleApi";
import ModalAddSchedule from "./components/ModalAddSchedule";
import ModalDeleteSchedule from "./components/ModalDeleteSchedule";
import DetailSchedule from "./components/DetailSchedule";

const ScheduleManagement = () => {
  const [schedule, setSchedule] = useState<any[]>([]);
  const [scheduleStylist, setScheduleStylist] = useState<any[]>([]);
  const userLogin = useSelector((state: RootState) => state.user);
  const [render, setRender] = useState(false);

  const groupByDay = () => {
    const grouped: { [key: string]: any[] } = {};
    const dataMap =
      (userLogin && userLogin["role"] === "admin" && schedule) ||
      (userLogin && userLogin["role"] === "stylist" && scheduleStylist) ||
      schedule;
    dataMap.forEach((item: any) => {
      const day = item.dayOfWeek;
      if (!grouped[day]) {
        grouped[day] = [];
      }
      grouped[day].push(item);
    });
    return grouped;
  };

  const groupedSchedules = groupByDay();

  const dateCellRender = (date: any) => {
    const dayOfWeek = date.format("dddd").toUpperCase();
    const items = groupedSchedules[dayOfWeek] || [];

    return (
      <ul style={{ padding: 0, listStyle: "none" }}>
        {items.map((item) => (
          <li key={item.scheduleID} className="mb-2">
            <Popover
              content={<DetailSchedule id={item.scheduleID} />}
              trigger={"click"}
            >
              <Tag
                className="!rounded-none"
                color={
                  item.scheduleStatus === "AVAILABLE"
                    ? "green-inverse"
                    : "red-inverse"
                }
              >
                {item.startTime}-{item.endTime}{" "}
                <span className="text-white font-bold">{item.stylistName}</span>
              </Tag>
            </Popover>
          </li>
        ))}
      </ul>
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await scheduleApi.getAllSchedule();
        setSchedule(response);
      } catch (error: any) {
        toast.error(error.message);
      }
    };
    const fetchDataStylist = async () => {
      try {
        const response = await scheduleApi.getScheduleByStylist(
          userLogin && userLogin["accountID"]
        );
        setScheduleStylist(response);
      } catch (error: any) {
        toast.error(error.message);
      }
    };
    fetchData();
    if (render) {
      fetchData();
    }
    if (userLogin && userLogin["role"] === "stylist") {
      fetchDataStylist();
    }
  }, [render, userLogin]);
  return (
    <>
      {userLogin &&
        (userLogin.role === "admin" || userLogin.role === "manager") && (
          <div className="flex gap-5">
            <ModalAddSchedule setRender={setRender} />
            <ModalDeleteSchedule setRender={setRender} />
          </div>
        )}
      <Calendar className="mt-5 p-2 rounded-xl" cellRender={dateCellRender} />
    </>
  );
};

export default ScheduleManagement;
