import { CSSProperties, Ref, ref } from 'vue';


export interface OverlayProps {
  containerStyle: CSSProperties;
  positionedStyle: Ref<CSSProperties>;
}

export abstract class PositionStrategy {
  abstract setup(panel: Ref<HTMLElement | null>, visible: Ref<boolean>): OverlayProps;
}