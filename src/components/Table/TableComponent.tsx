import Table, { ColumnProps } from "antd/es/table";
import React, { useContext, useEffect, useState } from "react";
import { Button, ConfigProvider, Form, Modal, Popconfirm, theme } from "antd";
import { toast } from "react-toastify";
import api from "../../config/axios/api";
import { ThemeContext } from "../../config/context/ThemeContext";
import ButtonComponent from "../Button/ButtonComponent";

export interface Column extends ColumnProps {
  title: string;
  dataIndex: string;
  key: string;
}

interface DashboardProps {
  columns: Column[];
  apiUri: string;
  formItem?: React.ReactElement;
  action?: boolean;
  title: string;
  typeForm?: "json" | "formData";
  uniqueName?: string;
  setImage?: any;
}

const TableComponent = ({
  columns,
  apiUri,
  formItem = <></>,
  action = true,
  title = "",
  typeForm = "json",
  uniqueName = "",
  setImage,
}: DashboardProps) => {
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);

  // Get dark mode state and toggle function from the ThemeContext
  const { isDarkMode } = useContext(ThemeContext);

  const handleOpenModal = () => {
    setOpen(true);
  };

  const handleEditModal = (values: any) => {
    setOpen(true);
    form.setFieldsValue(values);
    setImage([
      {
        uid: -1,
        name: values.serviceImage,
        status: "done",
        url: values.serviceImage,
      },
    ]);
  };

  const handleCloseModal = () => {
    form.resetFields();
    if (setImage) {
      setImage([]);
    }
    setOpen(false);
  };

  const fetchData = async () => {
    try {
      setIsFetching(true);
      const response = await api.get(`${apiUri}`);
      setDataSource(response.data);
    } catch (error: any) {
      toast.error(error.response.data.message);
    } finally {
      setIsFetching(false);
    }
  };

  const handleFinish = async (values: any) => {
    try {
      const headers =
        typeForm === "formData"
          ? { "Content-Type": "multipart/form-data" }
          : {};
      setLoading(true);
      const formData = new FormData();
      if (typeForm === "formData") {
        formData.append(
          "serviceRequest",
          JSON.stringify({
            serviceName: values.serviceName,
            servicePrice: values.servicePrice,
          })
        );
        const dataImage = values.serviceImage.file.originFileObj;
        formData.append("file", dataImage);
        if (values.serviceID) {
          await api.put(`${apiUri}/update/${values.serviceID}`, formData, {
            headers: headers,
          });
          toast.success(`Update ${title} success`);
        } else {
          await api.post(`${apiUri}/${uniqueName}`, formData, {
            headers: headers,
          });
          toast.success(`Add new ${title} success`);
        }
      } else {
        if (values.serviceID) {
          await api.put(`${apiUri}/update/${values.serviceID}`, values);
          toast.success(`Update ${title} success`);
        } else {
          await api.post(`${apiUri}/${uniqueName}`, values);
          toast.success(`Add new ${title} success`);
        }
      }
      fetchData();
      handleCloseModal();
    } catch (error: any) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: any) => {
    try {
      setLoading(true);
      await api.delete(`${apiUri}/delete/${id}`);
      toast.success(`Delete ${title} success`);
      fetchData();
    } catch (error: any) {
      toast.error(error.response.data);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    form.submit();
  };

  const actionColumn: Column = {
    title: "Action",
    key: "action",
    dataIndex: "serviceID",
    render: (_, record) => (
      <div className="flex gap-2">
        <Button type="primary" onClick={() => handleEditModal(record)}>
          Edit
        </Button>
        <Popconfirm
          title={`Are you sure to delete ${title}?`}
          okText={"Yes"}
          cancelText={"No"}
          onConfirm={() => handleDelete(record.serviceID)}
        >
          <Button danger>Delete</Button>
        </Popconfirm>
      </div>
    ),
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      {action && (
        <ButtonComponent onClick={handleOpenModal}>
          Add new {title}
        </ButtonComponent>
      )}

      {/* Ant Design ConfigProvider for dynamic theme change */}
      <ConfigProvider
        theme={{
          algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
        }}
      >
        <Table
          columns={action ? [...columns, actionColumn] : columns}
          dataSource={dataSource}
          loading={isFetching}
          className="
            mt-5 
            dark:bg-gray-800 dark:text-white dark:border-gray-700
            shadow-lg dark:shadow-gray-600 shadow-gray-200
          "
          bordered={true}
        />
      </ConfigProvider>

      {action && (
        <Modal
          title={`${title}`}
          open={open}
          onCancel={handleCloseModal}
          confirmLoading={loading}
          onOk={handleSubmit}
        >
          <Form onFinish={handleFinish} form={form} labelCol={{ span: 24 }}>
            {formItem}
          </Form>
        </Modal>
      )}
    </>
  );
};

export default TableComponent;
