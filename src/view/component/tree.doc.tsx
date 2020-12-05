import { defineComponent } from 'vue';
import { TreeNodeData, Tree } from 'power-ui';
export default defineComponent(() => {
  const data: TreeNodeData[] = [{
    label: '一级 1',
    key: '1',
    children: [{
      key: '1-1',
      label: '二级 1-1',
      children: [{
        key: '1-1-1',
        label: '三级 1-1-1'
      }]
    }]
  }, {
    key: '2',
    label: '一级 2',
    children: [{
      key: '2-1',
      label: '二级 2-1',
      children: [{
        key: '2-1-1',
        label: '三级 2-1-1'
      }]
    }, {
      key: '2-2',
      label: '二级 2-2',
      children: [{
        key: '2-2-1',
        label: '三级 2-2-1'
      }]
    }]
  }, {
    key: '3',
    label: '一级 3',
    children: [{
      key: '3-1',
      label: '二级 3-1',
      children: [{
        key: '3-1-1',
        label: '三级 3-1-1'
      }]
    }, {
      key: '3-2',
      label: '二级 3-2',
      children: [{
        key: '3-2-1',
        label: '三级 3-2-1'
      }]
    }]
  }];
  return () => (
    <Tree dataSource={data} emptyText={'空数据'}>
    </Tree>
  );
});