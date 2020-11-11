import { CdkAny } from '../types';
export const coerceCssPixelValue = (value: CdkAny) => {
    if (typeof value === 'number') {
        return `${value}px`;
    } else {
        return `${value ?? ''}`;
    }
}
