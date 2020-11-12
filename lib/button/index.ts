import { ElSize } from '@/types';
import { HTMLAttributes } from 'vue';
import { ElButtonType, ElButtonNativeType } from './types';

export * from './button';
export * from './button-group';
export * from './types';

export declare class Button {
  $props: {
    type?: ElButtonType,
    size?: ElSize,
    icon?: string,
    nativeType?: ElButtonNativeType,
    loading?: boolean,
    disabled?: boolean,
    plain?: boolean,
    autofocus?: boolean,
    round?: boolean,
    circle?: boolean;
  } & HTMLAttributes;
}
