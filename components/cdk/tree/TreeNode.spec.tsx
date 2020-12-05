import { defineComponent, provide } from 'vue';
import { CdkTree } from './tree';

export default defineComponent({
  name: 'cdk-tree-node-spec',
  setup() {
    const testData: any[] = [
      {
        label: 'test',
        content: 'tttttttt',
        value: 1,
        children: [
          { label: 'test', content: 'tttttttt' },
          { label: 'test', content: 'tttttttt' },
          { label: 'test', content: 'tttttttt' },
          { label: 'test', content: 'tttttttt' },
          { label: 'test', content: 'tttttttt' },
          {
            label: 'test2',
            content: '111',
            children: [
              { label: 'test3', content: 'tttttttt' }
            ]
          }
        ],
      },
    ];
    provide('cdk-tree-node-layer', 0);
    return () => (
      <div></div>
      // <CdkTree data={testData} getChilren={(data) => data.children} trackBy={(data)=> } />
    );
  },
});
