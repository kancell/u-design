import store from '@/store';
import { useSnapshot } from '@umijs/max';
import { Form, Input } from 'antd';
import React, { useEffect } from 'react';

const StartEventForm: React.FC = () => {
  const { nodeInfo, nodeEdit } = useSnapshot(store);

  const [form] = Form.useForm();

  const initValue = {
    id: undefined,
    name: undefined,
    type: undefined,
  };

  useEffect(() => {
    const data = { ...initValue, ...nodeInfo };
    form.setFieldsValue(data);
  }, [nodeInfo]);

  const formElement = (
    <Form
      form={form}
      name="开始节点"
      layout="vertical"
      labelCol={{ span: 24 }}
      wrapperCol={{ span: 24 }}
      onValuesChange={(e) => nodeEdit(e)}
    >
      <Form.Item
        label="节点ID"
        name="id"
        rules={[{ required: true, message: '节点ID' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="节点名称"
        name="name"
        rules={[{ required: true, message: '节点名称' }]}
      >
        <Input />
      </Form.Item>
    </Form>
  );

  return <div>{formElement}</div>;
};

export default StartEventForm;
