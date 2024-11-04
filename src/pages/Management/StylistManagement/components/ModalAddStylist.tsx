import { PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Form,
  GetProp,
  Image,
  Input,
  Modal,
  Upload,
  UploadFile,
  UploadProps,
} from "antd";
import { useState } from "react";
import { toast } from "react-toastify";
import ButtonComponent from "../../../../components/Button/ButtonComponent";
import { Stylist } from "../../../../model/Stylist";
import { stylistApi } from "../../../../service/stylistApi";

interface ModalAddStylistProps {
  setRender: any;
  id?: number;
  data?: Stylist;
}

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const ModalAddStylist = ({ setRender, id, data }: ModalAddStylistProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
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
  const handleOpen = async () => {
    setOpen(true);
    if (id && data) {
      const { stylistAvatar, ...rest } = data;
      setFileList([
        {
          uid: "-1",
          name: "image.png",
          status: "done",
          url: stylistAvatar,
        },
      ]);
      form.setFieldsValue(rest);
      form.setFieldsValue({
        stylistAvatar: fileList,
      });
      console.log(form.getFieldsValue());
    } else {
      form.resetFields();
      setFileList([]);
    }
  };
  const handleCancel = () => {
    setOpen(false);
    form.resetFields();
    setFileList([]);
  };

  const handleOk = () => {
    form.submit();
  };

  const handleFinish = async (values: any) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append(
        "stylist ",
        JSON.stringify({
          stylistName: values.stylistName,
          stylistPhone: values.stylistPhone,
          stylistEmail: values.stylistEmail,
          stylistInfor: values.stylistInfor,
        })
      );
      formData.append(
        id ? "file" : "files",
        values.stylistAvatar.file.originFileObj
      );
      if (id && data) {
        await stylistApi.updateStylist(id, formData);
        toast.success("Update success");
      } else {
        await stylistApi.addStylist(formData);
        toast.success("Add success");
      }
      setRender(true);
      handleCancel();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ButtonComponent onClick={handleOpen}>
        {id === undefined ? "Add new stylist" : "Edit"}
      </ButtonComponent>
      <Modal
        title={id === undefined ? "Add new stylist" : "Edit stylist"}
        onCancel={handleCancel}
        open={open}
        loading={loading}
        width={800}
        footer={[
          <Button type="primary" danger key={"cancel"} onClick={handleCancel}>
            Cancel
          </Button>,
          <Button type="primary" key={"submit"} onClick={handleOk}>
            Save
          </Button>,
        ]}
      >
        <Form
          labelCol={{ span: 24 }}
          form={form}
          onFinish={handleFinish}
          className="grid grid-cols-2 gap-5"
          initialValues={{
            role: "Stylist",
          }}
        >
          <Form.Item
            rules={[{ required: true, message: "Must not be empty" }]}
            name={"stylistName"}
            label={"Name"}
          >
            <Input />
          </Form.Item>
          <Form.Item
            rules={[
              { required: true, message: "Must not be empty" },
              { pattern: /^[0-9]*$/, message: "Please enter number" },
            ]}
            name={"stylistPhone"}
            label={"Phone"}
          >
            <Input />
          </Form.Item>
          <Form.Item
            rules={[
              { required: true, message: "Must not be empty" },
              {
                pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "Please enter a valid email address",
              },
            ]}
            name={"stylistEmail"}
            label={"Email"}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name={"stylistAvatar"}
            label={"Avatar"}
            className="col-span-2"
            rules={[{ required: true, message: "Must not be empty" }]}
          >
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
          <Form.Item
            rules={[{ required: true, message: "Must not be empty" }]}
            name={"stylistInfor"}
            label={"Information"}
            className="col-span-2"
          >
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ModalAddStylist;
