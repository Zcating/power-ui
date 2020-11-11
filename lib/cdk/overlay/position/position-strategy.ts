import { CSSProperties, Ref, ref } from 'vue';


export interface OverlayProps {
  containerStyle: CSSProperties;
  positionedStyle: Ref<CSSProperties>;
}

export abstract class PositionStrategy {
  setup(): OverlayProps {
    return {
      positionedStyle: ref({}),
      containerStyle: {}
    };
  }

  apply?(overlayElement: Element): void;

  disapply?(): void;

  abstract dispose(): void;
}