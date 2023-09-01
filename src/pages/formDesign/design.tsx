import React from 'react';
import SchemaBuilder from '@xrenders/schema-builder';
import { PageContainer } from '@ant-design/pro-components'

const FlowDesign:React.FC = () => {
  return <PageContainer
    token={{
      paddingBlockPageContainerContent: 12,

    }}
    header={{
      breadcrumb: {},
    }}
  >
    <div className='h-[calc(100vh-85px)]'>
      <SchemaBuilder importBtn={true} exportBtn={true} pubBtn={false} />
    </div>
  </PageContainer>
}

export default FlowDesign