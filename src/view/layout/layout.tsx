import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';
import { elementIcon } from './image';
import './layout.scss';

interface GroupNode {
  name: string;
  route?: string;
  children?: GroupNode[];
}

export const Layout = defineComponent({
  setup(_, ctx) {
    const data: GroupNode[] = [
      {
        name: 'CDK 组件开发工具',
        children: []
      }, {
        name: '组件',
        children: [
          {
            name: 'Basic',
            children: [
              {
                name: 'Button 按钮',
                route: 'component/button'
              }, {
                name: 'Icon 图标',
                route: 'component/icon'
              }, {
                name: 'Link 文字链接',
                route: 'component/link'
              }
            ]
          }, {
            name: 'Form',
            children: [
              {
                name: 'Radio 单选框',
                route: 'component/radio'
              }, {
                name: 'Checkbox 多选框',
                route: 'component/checkbox'
              }, {
                name: 'input 输入框',
                route: 'component/input'
              }, {
                name: 'inputNumber 文字输入框',
                route: 'component/input-number'
              }, {
                name: 'Select 选择器',
                route: 'component/select'
              }, {
                name: 'Cascader 级联选择器',
                route: 'component/cascader'
              }, {
                name: 'Switch 开关',
                route: 'component/switch'
              }, {
                name: 'Slider 滑块',
                route: 'component/slider'
              }, {
                name: 'TimePicker 时间选择器',
                route: 'component/time-picker'
              }, {
                name: 'DatePicker 日期选择器',
                route: 'component/date-picker'
              }, {
                name: 'DateTimePicker 日期时间选择器',
                route: 'component/date-time-picker'
              }, {
                name: 'Upload 上传',
                route: 'component/upload'
              }, {
                name: 'Rate 评分',
                route: 'component/rate'
              }, {
                name: 'ColorPicker 颜色选择器',
                route: 'component/color-picker'
              }, {
                name: 'Transfer 穿梭框',
                route: 'component/transfer'
              }, {
                name: 'Form 表单',
                route: 'component/form'
              }
            ],
          }, {
            name: 'Data',
            children: [
              {
                name: 'Table 表格',
                route: 'component/table'
              }, {
                name: 'Tag 标签',
                route: 'component/tag'
              }, {
                name: 'Progress 进度条',
                route: 'component/progress'
              }, {
                name: 'Tree 树',
                route: 'component/tree'
              }, {
                name: 'Pagination 分页',
                route: 'component/pagination'
              }, {
                name: 'Badge 标记',
                route: 'component/badge'
              }, {
                name: 'Avatar 头像',
                route: 'component/avatar'
              }
            ],
          }, {
            name: 'Notice',
            children: [
              {
                name: 'Alert 警告',
                route: 'component/alert'
              }, {
                name: 'Loading 加载中',
                route: 'component/loading'
              }, {
                name: 'Message 消息提示',
                route: 'component/message'
              }, {
                name: 'MessageBox 信息盒子',
                route: 'component/message-box'
              }, {
                name: 'Notification 提示',
                route: 'component/notification'
              }
            ]
          }, {
            name: 'Navigation',
            children: [
              {
                name: 'NavMenu 导航菜单',
                route: 'component/nav-menu'
              }, {
                name: 'Tabs 标签',
                route: 'component/tabs'
              }, {
                name: 'Breadcrumb 面包屑',
                route: 'component/breadcrumb'
              }, {
                name: 'Dropdown 下拉',
                route: 'component/dropdown'
              }, {
                name: 'Steps 步骤',
                route: 'component/steps'
              }
            ]
          }, {
            name: 'Other',
            children: [
              {
                name: 'Dialog 对话框',
                route: 'component/dialog'
              }, {
                name: 'Tooltip 提示',
                route: 'component/tooltip'
              }, {
                name: 'Popover 弹出框',
                route: 'component/popover'
              }, {
                name: 'Popconfirm 确认弹出框',
                route: 'component/popconfirm'
              }, {
                name: 'Card 卡片',
                route: 'component/card'
              }, {
                name: 'Carousel 跑马灯',
                route: 'component/carousel'
              }, {
                name: 'Collapse 折叠面板',
                route: 'component/collapse'
              }, {
                name: 'Timeline 时间线',
                route: 'component/timeline'
              }, {
                name: 'Divider 分割线',
                route: 'component/divider'
              }, {
                name: 'Calendar 日历',
                route: 'component/calendar'
              }, {
                name: 'Image 图像',
                route: 'component/image'
              }, {
                name: 'Backtop 回到顶部',
                route: 'component/backtop'
              }, {
                name: 'VirtualScroll 虚拟滚动',
                route: 'component/virtual-scroll'
              }, {
                name: 'Drawer 抽屉',
                route: 'component/drawer'
              }
            ]
          }
        ],
      }
    ];
    const router = useRouter();
    return () => (
      <div class="el-doc-container">
        <div class="el-doc__header">
          <img src={elementIcon} alt="element-logo" class="nav-logo" />
          <div></div>
        </div>
        <div class="el-doc">
          <div class="el-doc-sider">
            <ul>
              {data.map((node) => (
                <li class="nav-item">
                  <a>{node.name}</a>
                  {node.children?.map(child => (
                    <div class="nav-group">
                      <div class="nav-group__title">{child.name}</div>
                      <ul>
                        {child.children?.map(inner => (
                          <li class="nav-item">
                            <a onClick={() => inner.route && router.push(`/${inner.route}`)}>{inner.name}</a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </li>
              ))}
            </ul>
          </div>
          <div class="el-doc-content">
            {ctx.slots.default?.()}
          </div>
        </div>
        <div class="el-doc__footer">
          {ctx.slots.footer?.()}
        </div>
      </div>
    );
  }
});