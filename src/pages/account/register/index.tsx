import { PageContainer } from '@ant-design/pro-components';
import React from 'react';

const FlowDesign: React.FC = () => {
  return <PageContainer 
  header={{
    title: null,
    breadcrumb: {},
  }}
  token={{
    paddingBlockPageContainerContent: 0,
    paddingInlinePageContainerContent: 0,
  }}>1</PageContainer>;
};

export default FlowDesign;
