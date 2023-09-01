import React, { useEffect, useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-components'

import BpmnModeler from "bpmn-js/lib/Modeler";
import defaultXml from './defaultXml.js'

import styles from './index.css'
import { Button, message } from 'antd';
import minimapModule from "diagram-js-minimap";

//自定义左边栏
import CustomPalette from './customBpmn/palette'
// 翻译方法
import customTranslate from "./customBpmn/translate/customTranslate";
import translationsCN from "./customBpmn/translate/zh";

const FlowDesign:React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();

  /* bpmn实例 */
  const [bpmnInstance, SetBpmnInstance] = useState<any>(undefined)

  useEffect(() => {
    const viewer = new BpmnModeler({
      container: '#canvas',
      additionalModules: [
        minimapModule, 
        CustomPalette,
        {
          translate: ["value", customTranslate(translationsCN)]
        }
      ]
    });
    SetBpmnInstance(viewer)
    return () => {
      SetBpmnInstance(undefined)
    }
  }, [])

  /* 导入流程描述文件 */
  const initDiagram = async (existingXml?: string) => {
    let finaFile = existingXml ? existingXml : defaultXml
    try {
      const result = await bpmnInstance.importXML(finaFile);
      console.log(result);

      bpmnInstance.get("minimap").open();

      // 屏幕自适应
      const canvas = bpmnInstance.get("canvas");
      canvas.zoom("fit-viewport", true);

    } catch (err: any) {
      messageApi.error(err.message)
      console.log(err.message, err.warnings);
    }
  }

  useEffect(() => {
    if (bpmnInstance) {
      initDiagram()
    }
  }, [bpmnInstance])


  /* 导出文件ref */
  const saveSvgRef = useRef(null);
  const saveBpmnRef = useRef(null);

  const saveSVG = async () => {
    try {
      const result = await bpmnInstance.saveSVG();
      return result;
    } catch (err) {
      console.log(err);
    }
  }
  const saveXML = async () => {
    try {
      const result = await bpmnInstance.saveXML({ format: true });
      return result;
    } catch (err) {
      console.log(err);
    }
  }
  const setEncoded = (link:any, name:any, data:any) => {
    const encodedData = encodeURIComponent(data);
    if (data) {
      link.href = "data:application/bpmn20-xml;charset=UTF-8," + encodedData;
      link.download = name;
    }
  }

  /* 节点变化监听 */
  const addBpmnListener = async () => {
    const opscoffee = async () => {

      try {
        const result = await saveSVG();
        const { svg } = result;
        setEncoded(saveSvgRef.current, "ops-coffee.svg", svg);
      } catch (err) {
        console.log(err);
      }

      try {
        const result = await saveXML();
        const { xml } = result;
        setEncoded(saveBpmnRef.current, "ops-coffee.bpmn", xml);
      } catch (err) {
        console.log(err);
      }
    }
    opscoffee()
    bpmnInstance.on("commandStack.changed", opscoffee);
  }

  useEffect(() => {
    if (bpmnInstance) {
      addBpmnListener()
    }
  }, [bpmnInstance])

  /* 导入bpmnxml */
  const importBpmnRef = useRef<any>();
  const importFormRef = useRef<any>();

  const loadXML = async (e: { target: { files: any; }; }) => {
    const reader = new FileReader();
    reader.readAsText(e.target.files[0]);
    reader.onload = function(file) {
      if (file.target?.result && typeof file.target.result === 'string') {
        messageApi.success('导入数据结束')
        initDiagram(file.target.result)
        importFormRef.current.reset()
      }
    };
  }
  
  return <>
    <PageContainer
      token={{
        paddingBlockPageContainerContent: 12,

      }}
      header={{
        extra: [
          <Button key="1" onClick={() => importBpmnRef.current.click()}>
            导入BPMN文件
            <form ref={importFormRef} className='hidden'>
              <input type="file" ref={importBpmnRef} onChange={loadXML} accept='.bpmn,.xml'/>
            </form>
          </Button>,
        ],
        breadcrumb: {},
      }}
      footer={[
      <Button key="2">
        <a href="javascript:" ref={saveSvgRef} title="保存为bpmn">导出为SVG文件</a>
      </Button>,
      <Button key="3">
        <a href="javascript:" ref={saveBpmnRef} title="保存为bpmn">导出为BPMN文件</a>
      </Button>,
    ]}
    >
      <div id="canvas" className={styles.containers}></div>
    </PageContainer>
    { contextHolder }
  </>
}

export default FlowDesign