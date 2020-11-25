export interface PercentColor {
  color: string,
  progress?: number,
  percentage?: number
}

export type ElProgressType = 'line' | 'circle' | 'dashboard';

export type ElProgressStatus = 'success' | 'exception' | 'warning';

export const ColorFunction = Function as unknown as () => ((_: number) => string);

export const FormatFunction = Function as unknown as () => ((percentage: number) => string);



export const StringArray = Array as () => string[];