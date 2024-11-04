import { Form, Image, Input, Upload } from "antd";
import TableComponent, {
  Column,
} from "../../../../components/Table/TableComponent";
import { formatVND } from "../../../../utils/formatPrice";
import type { GetProp, UploadFile, UploadProps } from "antd";
import { useState } from "react";
import { PlusOutlined } from "@ant-design/icons";

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const ServiceManagementTable = () => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) =>
    setFileList(newFileList);

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );
  const column: Column[] = [
    {
      dataIndex: "serviceID",
      key: "id",
      title: "#",
    },
    {
      dataIndex: "serviceImage",
      key: "image",
      title: "Image",
      render: (data) => <Image src={data} width={150} height={150} />,
    },
    {
      dataIndex: "serviceName",
      key: "id",
      title: "Name",
    },
    {
      dataIndex: "servicePrice",
      key: "id",
      title: "Price",
      render: (data) => formatVND(data),
    },
  ];

  const formItem = (
    <>
      <Form.Item name={"serviceName"} label={"Service name"}>
        <Input />
      </Form.Item>
      <Form.Item name={"servicePrice"} label="Price">
        <Input type="number" />
      </Form.Item>
      <Form.Item name={"serviceID"}>
        <Input />
      </Form.Item>
      <Form.Item name={"serviceImage"} label={"Image"}>
        <Upload
          listType="picture-card"
          fileList={fileList}
          onPreview={handlePreview}
          onChange={handleChange}
          maxCount={1}
        >
          {fileList.length === 1 ? null : uploadButton}
        </Upload>
      </Form.Item>
      {previewImage && (
        <Image
          wrapperStyle={{ display: "none" }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(""),
          }}
          src={previewImage}
        />
      )}
    </>
  );

  return (
    <div>
      <TableComponent
        setImage={setFileList}
        title="Services"
        apiUri="services-management"
        columns={column}
        formItem={formItem}
        typeForm="formData"
        uniqueName="create-service"
      />
    </div>
  );
};

export default ServiceManagementTable;
