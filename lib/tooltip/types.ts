import { ConnectionPosition } from '../cdk/overlay';

export type Placement = 'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'left' | 'left-start' | 'left-end' | 'right' | 'right-start' | 'right-end';

export type ArrowPlacement = 'top' | 'left' | 'bottom' | 'right';

export type TriggerType = 'click' | 'focus' | 'hover';

export const OVERLAY_POSITION_MAP: { [key in string]: ConnectionPosition } = {
  'top': { originX: 'center', originY: 'top', overlayX: 'center', overlayY: 'bottom' },
  'top-start': { originX: 'left', originY: 'top', overlayX: 'left', overlayY: 'bottom' },
  'top-end': { originX: 'right', originY: 'top', overlayX: 'right', overlayY: 'bottom' },
  'bottom': { originX: 'center', originY: 'bottom', overlayX: 'center', overlayY: 'top' },
  'bottom-start': { originX: 'left', originY: 'bottom', overlayX: 'left', overlayY: 'top' },
  'bottom-end': { originX: 'right', originY: 'bottom', overlayX: 'right', overlayY: 'top' },
  'left': { originX: 'left', originY: 'center', overlayX: 'right', overlayY: 'center' },
  'left-start': { originX: 'left', originY: 'top', overlayX: 'right', overlayY: 'top' },
  'left-end': { originX: 'left', originY: 'bottom', overlayX: 'right', overlayY: 'bottom' },
  'right': { originX: 'right', originY: 'center', overlayX: 'left', overlayY: 'center' },
  'right-start': { originX: 'right', originY: 'top', overlayX: 'left', overlayY: 'top' },
  'right-end': { originX: 'right', originY: 'bottom', overlayX: 'left', overlayY: 'bottom' },
}
