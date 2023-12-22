import store from '@/store';
import { useSnapshot } from '@umijs/max';
import { Form, Input } from 'antd';
import React, { useEffect } from 'react';

const BaseForm: React.FC = () => {
  const { nodeInfo, nodeEdit } = useSnapshot(store);

  const [form] = Form.useForm();

  const initValue = {
    id: undefined,
    name: undefined,
    type: undefined,
    documentation: undefined,
  };

  useEffect(() => {
    const data = { ...initValue, ...nodeInfo };
    form.setFieldsValue(data);
  }, [nodeInfo]);

  const formElement = (
    <Form
      form={form}
      name="基础信息表"
      layout="vertical"
      className='grid grid-cols-2 gap-x-3'
      labelCol={{ span: 24 }}
      wrapperCol={{ span: 24 }}
      onValuesChange={(e) => nodeEdit(e)}
    >
      <Form.Item
        label={nodeInfo.$type === 'bpmn:Process' ? '流程ID' : '节点ID'}
        name="id"
        rules={[{ required: true, message: '节点ID' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label={nodeInfo.$type === 'bpmn:Process' ? '流程名称' : '节点名称'}
        name="name"
      >
        <Input />
      </Form.Item>
      <Form.Item
        label={nodeInfo.$type === 'bpmn:Process' ? '流程描述' : '节点描述'}
        name="documentation"
      >
        <Input.TextArea />
      </Form.Item>
    </Form>
  );

  return <div>{formElement}</div>;
};

export default BaseForm;
