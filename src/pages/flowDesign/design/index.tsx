import { PageContainer } from "@ant-design/pro-components";
import Bpmn from '@/components/Bpmn/index'
const FlowDesign: React.FC = () => {
  return (
    <>
      <PageContainer
        header={{
          breadcrumb: {},
          title: null,
        }}
        token={{
          paddingBlockPageContainerContent: 0,
          paddingInlinePageContainerContent: 0,
        }}
      >
        <Bpmn/>
      </PageContainer>
    </>
  );
};

export default FlowDesign;
