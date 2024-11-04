import { Button, Form, Modal, Select } from "antd";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { scheduleApi } from "../../../../service/scheduleApi";

interface ModalDeleteSchedule {
  setRender: any;
}
const ModalDeleteSchedule = ({ setRender }: ModalDeleteSchedule) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [groupedSchedules, setGroupedSchedules] = useState<any[]>([]);
  const [form] = Form.useForm();
  const handleCancel = () => {
    setOpen(false);
    form.resetFields();
  };

  const handleDelete = async (values: any) => {
    try {
      setLoading(true);
      await scheduleApi.deleteSchedule(values.schedule);
      setRender(true);
      toast.success("Delete success");
      handleCancel();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        setLoading(true);
        const response = await scheduleApi.getAllSchedule();
        const grouped = response.reduce((acc: any, schedule: any) => {
          const { stylistID, stylistName } = schedule;
          if (!acc[stylistID]) {
            acc[stylistID] = { stylistName, schedules: [] };
          }
          acc[stylistID].schedules.push(schedule);
          return acc;
        }, {});

        const groupedArray = Object.entries(grouped).map(
          ([id, { stylistName, schedules }]: any) => ({
            stylistID: id,
            stylistName,
            schedules,
          })
        );
        setGroupedSchedules(groupedArray);
      } catch (error: any) {
        toast.error(error.message || "Failed to fetch stylists.");
      } finally {
        setLoading(false);
      }
    };
    if (open) {
      fetchSchedule();
    }
  }, [open]);

  return (
    <>
      <Button type="primary" danger onClick={() => setOpen(true)}>
        Delete Schedule
      </Button>
      <Modal
        loading={loading}
        onCancel={handleCancel}
        open={open}
        title="Delete Schedule"
        width={500}
        onOk={() => form.submit()}
      >
        <Form
          form={form}
          layout="vertical"
          labelCol={{ span: 24 }}
          onFinish={handleDelete}
        >
          <Form.Item label="Select Schedule" name={"schedule"} required>
            <Select
              placeholder="Select a schedule"
              style={{ width: "100%" }}
              allowClear
            >
              {groupedSchedules.map(({ stylistID, stylistName, schedules }) => (
                <Select.OptGroup label={stylistName} key={stylistID}>
                  {schedules.map((schedule: any) => (
                    <Select.Option
                      key={schedule.scheduleID}
                      value={schedule.scheduleID}
                    >
                      {`${schedule.dayOfWeek}: ${schedule.startTime} - ${schedule.endTime}`}
                    </Select.Option>
                  ))}
                </Select.OptGroup>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ModalDeleteSchedule;
