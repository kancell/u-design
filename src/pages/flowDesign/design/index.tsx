import store from '@/store';
import { PageContainer } from '@ant-design/pro-components';
import { useSnapshot } from '@umijs/max';
import { Button, Card, message } from 'antd';
import React, { useEffect, useRef, useState } from 'react';

// 自定义bpmn样式
import styles from './index.css';

import BpmnModeler from 'bpmn-js/lib/Modeler';
import defaultXml from './defaultXml.js';
//小地图工具
import minimapModule from 'diagram-js-minimap';
//自定义左边栏
import CustomPalette from './customBpmn/palette';
// 自定义工具栏
import CustomContextPad from './customBpmn/contentPad';
// 翻译方法
import customTranslate from './customBpmn/translate/customTranslate';
import translationsCN from './customBpmn/translate/zh';

import StartEventForm from './component/startEventForm';

const FlowDesign: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();
  /* 数据流 */
  const { nodeVisibleChange, nodeInfo, nodeChange } = useSnapshot(store);
  /* bpmn实例 */
  const [bpmnInstance, SetBpmnInstance] = useState<any>(undefined);

  /* 新建及退出时销毁BpmnModeler实例 */
  useEffect(() => {
    const modeler = new BpmnModeler({
      container: '#canvas',
      additionalModules: [
        minimapModule,
        CustomPalette,
        CustomContextPad,
        {
          translate: ['value', customTranslate(translationsCN)],
        },
      ],
    });
    SetBpmnInstance(modeler);
    return () => {
      SetBpmnInstance(undefined);
    };
  }, []);

  /* 导入流程描述文件 */
  const initDiagram = async (existingXml?: string) => {
    let finaFile = existingXml ? existingXml : defaultXml;
    try {
      const result = await bpmnInstance.importXML(finaFile);
      console.log(result);

      // 屏幕自适应
      const canvas = bpmnInstance.get('canvas');
      canvas.zoom('fit-viewport', true);
    } catch (err: any) {
      messageApi.error(err.message);
      console.log(err.message, err.warnings);
    }
  };

  /* 点击事件  */
  const creatEventBus = () => {
    const eventBus = bpmnInstance.get('eventBus');
    // 注册节点事件，eventTypes中可以写多个事件//
    const eventTypes = ['element.click', 'element.hover'];
    eventTypes.forEach((eventType) => {
      eventBus.on(eventType, (e: any) => {
        const { element } = e;
        if (!e) return;
        switch (eventType) {
          case 'element.click':
            nodeVisibleChange(true);
            nodeChange(element);
            break;
          case 'element.hover':
            //console.log('hover', element)
            break;
          default:
            break;
        }
      });
    });
  };

  const nodeEditForm = (
    <div className="absolute z-20 top-4 right-4">
      <Card title={nodeInfo.$type} className="border border-solid w-72">
        <StartEventForm />
      </Card>
    </div>
  );

  useEffect(() => {
    if (!bpmnInstance) return;
    const elementRegistry = bpmnInstance.get('elementRegistry');
    const modeling = bpmnInstance.get('modeling');
    modeling.updateLabel(elementRegistry.get(nodeInfo.id), nodeInfo.name);
  }, [nodeInfo.name]);

  useEffect(() => {
    if (bpmnInstance) {
      initDiagram();
      creatEventBus();
    }
  }, [bpmnInstance]);

  /* 查询所有节点 */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const queryAllElement = () => {
    if (!bpmnInstance) return;
    const elementRegistry = bpmnInstance.get('elementRegistry');
    const userTaskList = elementRegistry.filter((item: any) => {
      console.log(item);
      return item.type === 'bpmn:UserTask';
    });
    console.log(userTaskList);
  };

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
  };
  const saveXML = async () => {
    try {
      const result = await bpmnInstance.saveXML({ format: true });
      return result;
    } catch (err) {
      console.log(err);
    }
  };
  const setEncoded = (link: any, name: any, data: any) => {
    const encodedData = encodeURIComponent(data);
    if (data) {
      link.href = 'data:application/bpmn20-xml;charset=UTF-8,' + encodedData;
      link.download = name;
    }
  };

  /* 节点变化监听 */
  const addBpmnListener = async () => {
    const opscoffee = async () => {
      try {
        const result = await saveSVG();
        const { svg } = result;
        setEncoded(saveSvgRef.current, 'ops-coffee.svg', svg);
      } catch (err) {
        console.log(err);
      }
      try {
        const result = await saveXML();
        const { xml } = result;
        setEncoded(saveBpmnRef.current, 'ops-coffee.bpmn', xml);
      } catch (err) {
        console.log(err);
      }
    };
    opscoffee();
    bpmnInstance.on('commandStack.changed', opscoffee);
  };

  useEffect(() => {
    if (bpmnInstance) {
      addBpmnListener();
    }
  }, [bpmnInstance]);

  /* 导入bpmnxml */
  const importBpmnRef = useRef<any>();
  const importFormRef = useRef<any>();

  const loadXML = async (e: { target: { files: any } }) => {
    const reader = new FileReader();
    reader.readAsText(e.target.files[0]);
    reader.onload = function (file) {
      if (file.target?.result && typeof file.target.result === 'string') {
        messageApi.success('导入数据结束');
        initDiagram(file.target.result);
        importFormRef.current.reset();
      }
    };
  };

  return (
    <>
      <PageContainer
        token={{
          paddingBlockPageContainerContent: 14,
        }}
        header={{
          extra: [
            <Button key="1" onClick={() => importBpmnRef.current.click()}>
              导入BPMN文件
              <form ref={importFormRef} className="hidden">
                <input
                  type="file"
                  ref={importBpmnRef}
                  onChange={loadXML}
                  accept=".bpmn,.xml"
                />
              </form>
            </Button>,
            <Button key="2" onClick={() => queryAllElement()}>
              测试
            </Button>,
            <Button key="3">
              <a href="javascript:" ref={saveSvgRef} title="保存为bpmn">
                导出为SVG文件
              </a>
            </Button>,
            <Button key="4">
              <a href="javascript:" ref={saveBpmnRef} title="保存为bpmn">
                导出为BPMN文件
              </a>
            </Button>,
          ],
        }}
      >
        <div className="-mx-10">
          <div id="canvas" className={styles.containers}>
            {nodeEditForm}
          </div>
        </div>
      </PageContainer>
      {contextHolder}
    </>
  );
};

export default FlowDesign;
