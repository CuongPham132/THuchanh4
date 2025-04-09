import React from 'react';
import { Form, Input, Select, Button, message } from 'antd';
import { addApplication } from '@/models/applicationModel';

const { Option } = Select;

const RegisterForm = () => {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    const newApp = {
      ...values,
      key: Date.now(),
      status: 'Pending',
    };
    addApplication(newApp);
    message.success('Đăng ký thành công!');
    form.resetFields();
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      style={{
        maxWidth: '100%',
        width: '100%',
        padding: '16px',
        boxSizing: 'border-box',
      }}
      className="form-wrapper"
    >
      <h2>Đăng ký ứng tuyển</h2>

      <Form.Item
        label="Họ tên"
        name="name"
        rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Email"
        name="email"
        rules={[{ required: true, type: 'email', message: 'Email không hợp lệ!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Nguyện vọng"
        name="nguyenVong"
        rules={[{ required: true, message: 'Vui lòng chọn nguyện vọng!' }]}
      >
        <Select placeholder="Chọn nguyện vọng">
          <Option value="Design">Design</Option>
          <Option value="Dev">Dev</Option>
          <Option value="Media">Media</Option>
        </Select>
      </Form.Item>

      <Form.Item
        label="Lý do đăng ký"
        name="reason"
        rules={[{ required: true, message: 'Vui lòng nhập lý do!' }]}
      >
        <Input.TextArea rows={4} />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" block>
          Gửi đăng ký
        </Button>
      </Form.Item>
    </Form>
  );
};

export default RegisterForm;
