import store from '@/store';
import { useSnapshot } from '@umijs/max';
import { Form, Input, InputNumber, Select } from 'antd';
import React, { useEffect } from 'react';

const UserTaskForm: React.FC = () => {
  const { nodeInfo, nodeEdit } = useSnapshot(store);
  const canUse = ['bpmn:UserTask'].includes(nodeInfo.$type)

  const [form] = Form.useForm();

  const initValue = {
    formKey: undefined
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
      name="节点表单配置"
      layout="vertical"
      className='grid grid-cols-2 gap-x-3'
      labelCol={{ span: 24 }}
      wrapperCol={{ span: 24 }}
      onValuesChange={(e) => nodeEdit(e)}
    >
      <Form.Item
        label='节点表单'
        name="formKey"
        rules={[{ required: true, message: '节点表单' }]}
      >
        <Select
          options={[
            { value: '1', label: '表单1' },
            { value: '2', label: '表单2' },
            { value: '3', label: '表单3' },
          ]}
        />
      </Form.Item>
    </Form>
  )
  : <div></div>

  return <div>{formElement}</div>;
};

export default UserTaskForm;
