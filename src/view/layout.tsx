import { defineComponent } from 'vue';

export const Layout = defineComponent({
  setup(_, ctx) {
    return () => (
      <div class="el-doc">
        <div class="el-doc-header">
          <div></div>
          <div></div>
        </div>
        <div class="el-doc">
          <div class="el-doc-sider">
            
          </div>
          <div class="el-doc-content">
            {ctx.slots.default?.()}
          </div>
        </div>
        <div class="el-doc-footer">
          {ctx.slots.footer?.()}
        </div>
      </div>
    );
  }
});