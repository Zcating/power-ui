import { CSSProperties, Ref } from 'vue';


export interface OverlayProps {
  containerStyle: CSSProperties;
  positionedStyle: CSSProperties;
}

export abstract class PositionStrategy {
  abstract setup(panel: Ref<HTMLElement | null>, visible: Ref<boolean>): OverlayProps;
}