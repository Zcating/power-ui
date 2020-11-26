import { ElSize } from '../types';
import { CSSProperties } from 'vue';
import { ElButtonNativeType, ElButtonType } from './types';

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
    placeholder?: string,
    onClick?: (e: MouseEvent) => void;

    id?: string,
    class?: any,
    style?: string | CSSProperties,
  };
}
