import { PageContainer } from '@ant-design/pro-components';
import SchemaBuilder from '@xrenders/schema-builder';
import React from 'react';

const FlowDesign: React.FC = () => {
  return (
    <PageContainer
      header={{
        breadcrumb: {},
      }}
    >
      <div className="h-[calc(100vh-85px)]">
        <SchemaBuilder importBtn={true} exportBtn={true} pubBtn={false} />
      </div>
    </PageContainer>
  );
};

export default FlowDesign;
