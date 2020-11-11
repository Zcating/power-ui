import {
  defineComponent,
  inject,
  onMounted,
  provide,
  ref,
  renderSlot,
} from "vue";

// breadcrumb container
export const Breadcrumb = defineComponent({
  name: "ele-breadcrumb",
  props: {
    seperator: {
      type: String,
      default: "/",
    },
    seperatorClass: {
      type: String,
      default: "",
    },
    onSelected: {
      type: Function,
      default: () => {},
    },
  },
  setup(props, ctx) {
    const containerRef = ref<HTMLDivElement | null>(null);
    provide("ele-breadcrumb", { props, containerRef });
    onMounted(() => {
      if (!containerRef.value) return;
      const items = containerRef.value.querySelectorAll(".el-breadcrumb__item");
      if (items.length) {
        items[items.length - 1].setAttribute("aria-current", "page");
      }
    });
    return () => (
      <div
        class='el-breadcrumb'
        aria-label='Breadcrumb'
        role='navigation'
        ref={containerRef}
      >
        {renderSlot(ctx.slots, "default")}
      </div>
    );
  },
});

//breadcrumb item
export const BreadcrumbItem = defineComponent({
  name: "ele-breadcrumb-item",
  props: {
    value: {
      type: String,
      default: "",
    },
  },
  setup(props, ctx) {
    const breadcrumb = inject("ele-breadcrumb", {
      props: { seperator: "/", seperatorClass: "", onSelected: Function },
    });
    return () => (
      <span class='el-breadcrumb__item'>
        <span
          class='el-breadcrumb__inner is-link'
          role='link'
          onClick={() => {
            breadcrumb.props.onSelected(props.value);
          }}
        >
          {renderSlot(ctx.slots, "default")}
        </span>
        {breadcrumb.props.seperatorClass ? (
          <i
            class={[
              "el-breadcrumb__separator",
              breadcrumb.props.seperatorClass,
            ]}
          ></i>
        ) : (
          <span class='el-breadcrumb__separator' role='presentation'>
            {breadcrumb.props.seperator}
          </span>
        )}
      </span>
    );
  },
});
