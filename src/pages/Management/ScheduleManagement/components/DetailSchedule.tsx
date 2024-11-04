import { Spin } from "antd";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { scheduleApi } from "../../../../service/scheduleApi";

interface DetailScheduleProps {
  id: number;
}

const DetailSchedule = ({ id }: DetailScheduleProps) => {
  const [loading, setLoading] = useState(false);
  const [detail, setDetail] = useState<any>();
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await scheduleApi.getDetailSchedule(id);
        setDetail(response);
      } catch (error: any) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);
  return !loading ? (
    <div>
      {detail && (
        <>
          <p>
            <span>Name: </span>
            <span className="font-black">{detail.stylistName}</span>
          </p>
          <p>
            {detail.startTime} - {detail.endTime}
          </p>
          <p>{detail.scheduleStatus}</p>
        </>
      )}
    </div>
  ) : (
    <Spin />
  );
};

export default DetailSchedule;
