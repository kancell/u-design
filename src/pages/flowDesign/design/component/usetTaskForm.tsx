import { Form, Input } from 'antd';
import React from 'react';

const StartForm: React.FC = () => {
  const formRef = React.useRef(null);

  const formElement = (
    <Form
      ref={formRef}
      name="开始节点"
      layout="vertical"
      labelCol={{ span: 24 }}
      wrapperCol={{ span: 24 }}
      onValuesChange={(e) => console.log(e)}
    >
      <Form.Item
        label="节点名称"
        name="nodeName"
        rules={[{ required: true, message: '节点名称' }]}
      >
        <Input />
      </Form.Item>
    </Form>
  );

  return <div>{formElement}</div>;
};

export default StartForm;
