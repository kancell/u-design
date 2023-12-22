import store from '@/store';
import { PageContainer } from '@ant-design/pro-components';
import { useSnapshot } from '@umijs/max';
import { Button, Card, message } from 'antd';
import React, { useEffect, useRef, useState } from 'react';

// 自定义bpmn样式

import 'bpmn-js/dist/assets/diagram-js.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css'
import styles from './index.css';

import BpmnModeler from 'bpmn-js/lib/Modeler';
import defaultXml from './defaultXml.js';

//自定义左边栏
import CustomPalette from './customBpmn/palette';
// 自定义工具栏
// 翻译方法
import customTranslate from './customBpmn/translate/customTranslate';
import translationsCN from './customBpmn/translate/zh';

import BaseForm from './component/baseForm';
import UserTaskForm from './component/taskForm';
import ProcessForm from './component/processForm';

const nodeTitleRep: any = {
  'bpmn:StartEvent': '开始节点',
  'bpmn:EndEvent': '结束节点',
  'bpmn:Task': '任务节点',
  'bpmn:UserTask': '用户任务节点',
  'bpmn:Process': '流程配置',
};

const FlowDesign: React.FC = () => {
  
  const [messageApi, contextHolder] = message.useMessage();
  /* 数据流 */
  const { nodeVisible, nodeVisibleChange, nodeInfo, nodeChange } = useSnapshot(store);
  /* bpmn实例 */
  const [bpmnInstance, SetBpmnInstance] = useState<any>(undefined);

  /* 新建及退出时销毁BpmnModeler实例 */
  useEffect(() => {
    const modeler = new BpmnModeler({
      container: '#canvas',
      additionalModules: [
        CustomPalette,
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

  function useStateRef(state: any) {
    const stateRef = useRef<any>()
    useEffect(() => {
      stateRef.current = state
      return () => {}
    }, [state])
    return stateRef
  }

  const [selectNode, setSelectNode] = useState<any>();
  //let selectNode:any = null
  /* 初始点击设置 */
  const initForm = () => {
    const elementRegistry = bpmnInstance.get('elementRegistry');
    const elementList = elementRegistry.filter((item: any) => {
      return item;
    });
    if (elementList.length > 0) {
      nodeVisibleChange(true);
      nodeChange(elementList[0]);
      setSelectNode(elementList[0])
    }
  };

  /* 导入流程描述文件 */
  const initDiagram = async (existingXml?: string) => {
    let finaFile = existingXml ? existingXml : defaultXml;
    try {
      const result = await bpmnInstance.importXML(finaFile);
      console.log(result);

      // 屏幕自适应
      const canvas = bpmnInstance.get('canvas');
      canvas.zoom('fit-viewport', true);
      initForm();
    } catch (err: any) {
      messageApi.error(err.message);
      console.log(err.message, err.warnings);
    }
  };

  /* 点击事件  */
  const creatEventBus = () => {
    const eventBus = bpmnInstance.get('eventBus');
    // 注册节点事件，eventTypes中可以写多个事件//
    const eventTypes = ['element.click', 'element.hover', 'element.changed', 'selection.changed'];
    eventTypes.forEach((eventType) => {
      eventBus.on(eventType, (e: any) => {
        const { element } = e;
        // 不显示任务框的节点
        const noEventNode = ['bpmn:Association', 'bpmn:TextAnnotation'];
        if (!e || !element || noEventNode.includes(element.type)) {
          nodeVisibleChange(false);
          return;
        }
        switch (eventType) {
          case 'element.click':
            nodeVisibleChange(true);
            nodeChange(element); 
            setSelectNode(element)
            break;
          case 'element.hover':
            //console.log('hover', element)
            break;
          case 'selection.changed':
            console.log(element)
       
            break;
          case 'element.changed':
            
            if (selectNode && selectNode.id === element.id) {
              nodeChange(element);
            }
            break;
          default:
            break;
        }
      });
    });
  };

  /* 实例生成后事件 */
  useEffect(() => {
    if (bpmnInstance) {
      initDiagram();
      creatEventBus();
    }
  }, [bpmnInstance]);

  // 更新节点
  useEffect(() => {
    if (!bpmnInstance || !selectNode) return;
    const modeling = bpmnInstance.get('modeling');
    
    modeling.updateProperties(selectNode, { id: nodeInfo.id });
    modeling.updateProperties(selectNode, { name: nodeInfo.name });

    if (!nodeInfo.documentation) {
      modeling.updateProperties(selectNode, { documentation: [] });
      return;
    }
    const documentationElement = bpmnInstance
      .get('moddle')
      .create('bpmn:Documentation', { text: nodeInfo.documentation });
    modeling.updateProperties(selectNode, {
      documentation: [documentationElement],
    });
  }, [nodeInfo, selectNode]);

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

  const generatorFunc = async () => {
    try {
      const result = await saveSVG();
      const { svg } = result;
      setEncoded(saveSvgRef.current, 'process.svg', svg);
    } catch (err) {}
    try {
      const result = await saveXML();
      const { xml } = result;
      setEncoded(saveBpmnRef.current, 'process.bpmn', xml);
    } catch (err) {
      console.log(err);
    }
  };
  /* 节点变化监听 */
  const addBpmnListener = async () => {
    generatorFunc();
    bpmnInstance.on('commandStack.changed', generatorFunc);
  };

  useEffect(() => {
    if (bpmnInstance) {
      addBpmnListener();
    }
  }, [bpmnInstance]);

  /* 查询所有节点 */
  const queryAllElement = async () => {
    if (!bpmnInstance) return;
    const elementRegistry = bpmnInstance.get('elementRegistry');
    const userTaskList = elementRegistry.filter((item: any) => {
      return item;
    });
    console.log(elementRegistry, userTaskList);
    console.log(await saveXML());
  };

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

  /*顶栏工具栏  */
  const toolBar = <div className='flex justify-between'>
    <Button key="1" onClick={() => importBpmnRef.current.click()} className='ml-6'>
      导入BPMN文件
      <form ref={importFormRef} className="hidden">
        <input
          type="file"
          ref={importBpmnRef}
          onChange={loadXML}
          accept=".bpmn,.xml"
        />
      </form>
    </Button>
    <Button key="2" onClick={() => queryAllElement()} className='ml-2'>
      测试
      {
        JSON.stringify(nodeInfo)
      }
    </Button>
    <Button key="3" className='ml-2'>
      <a href="javascript:" ref={saveSvgRef} title="保存为bpmn">
        导出为SVG文件
      </a>
    </Button>
    <Button key="4" className='ml-2'>
      <a href="javascript:" ref={saveBpmnRef} title="保存为bpmn">
        导出为BPMN文件
      </a>
    </Button>
  </div> 

  /* 侧边栏信息配置表单 */
  const nodeEditForm = nodeVisible && (
    <>
      <div className="absolute z-20 top-4 right-4">
        <Card
         
          title={nodeTitleRep[nodeInfo.$type] ?? '节点'}
          className="border border-solid shadow-lg w-96"
        >
          <BaseForm />
          <UserTaskForm />
          <ProcessForm/>
        </Card>
      </div>
    </>
  );

  return (
    <>
      <div className='flex items-center h-12'>
        { toolBar }
      </div>
      <div id="canvas" className={styles.containers}>
        {nodeEditForm}
      </div>
      {contextHolder}
    </>
  );
};

export default FlowDesign;
