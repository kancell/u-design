import store from '@/store';
import { useSnapshot } from '@umijs/max';
import { Form, Input, InputNumber, Select } from 'antd';
import React, { useEffect } from 'react';

const UserTaskForm: React.FC = () => {
  const { nodeInfo, nodeEdit } = useSnapshot(store);
  const canUse = ['bpmn:Task','bpmn:UserTask'].includes(nodeInfo.$type)

  const [form] = Form.useForm();

  const initValue = {
    id: undefined,
    userType: undefined,
    first: undefined,
    documentation: undefined,
  };

  useEffect(() => {
    if (canUse) {
      const data = { ...initValue, ...nodeInfo };
      form.setFieldsValue(data);
    }

  }, [nodeInfo]);

  const formElement = canUse
  ? (
    <Form
      form={form}
      name="任务人员配置"
      layout="vertical"
      className='grid grid-cols-2 gap-x-3'
      labelCol={{ span: 24 }}
      wrapperCol={{ span: 24 }}
      onValuesChange={(e) => nodeEdit(e)}
    >
      <Form.Item
        label='用户类型'
        name="userType"
        rules={[{ required: true, message: '用户类型' }]}
      >
        <Select
          options={[
            { value: '指定人员', label: '指定人员' },
            { value: '候选人员', label: '候选人员' },
            { value: '候选角色', label: '候选角色' },
          ]}
        />
      </Form.Item>
      <Form.Item
        label='优先级'
        name="first"
      >
        <InputNumber min={1} max={10} addonAfter="级"/>
      </Form.Item>
    </Form>
  )
  : <div></div>

  return <div>{formElement}</div>;
};

export default UserTaskForm;
