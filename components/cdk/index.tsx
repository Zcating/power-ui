import { App } from 'vue';

import { cdkBidirection } from './bidirection';
import { cdkBreakpoint } from './breakpoint';
import { cdkViewport } from './viewport';
import { cdkPlatform, Platform } from './platform';
import { cdkOverlay } from './overlay';
import { cdkClipboard } from './clipboard';

export * from './date';
export * from './overlay';
export * from './tree';
export * from './keycodes';
export * from './platform';
export * from './coercion';
export * from './types';
export * from './collections';
export * from './coercion';

export { useBreakpoint } from './breakpoint';
export { useBidirection } from './bidirection';
export { useClipboard } from './clipboard';
export { useViewport } from './viewport';

/**
 * @export cdk
 */
export const cdk = {
  install(app: App, platformPlugins: string[] | 'all' = 'all', noMixin = false) {
    const platform = new Platform();
    app.use(cdkPlatform, platform);
    if (platformPlugins === 'all') {
      app.use(cdkBidirection, platform, noMixin);
      app.use(cdkViewport, platform, noMixin);
      app.use(cdkBreakpoint, platform, noMixin);
      app.use(cdkClipboard, platform, noMixin);
    }
    app.use(cdkOverlay, platform);
  }
};
