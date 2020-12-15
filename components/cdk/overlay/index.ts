import { App } from 'vue';
import { Platform } from 'vue-cdk/platform';
import { Overlay } from './overlay';

export * from './overlay';
export * from './position';
export const cdkOverlay = {
  install(app: App, platform: Platform) {
    app.component(Overlay.name, Overlay);
    // add overlay anchor
    if (platform.DOCUMENT && platform.BODY) {
      // if at browser environment
      const overlayAnchor = platform.DOCUMENT.createElement('div');
      overlayAnchor.setAttribute('id', 'cdk-overlay-anchor');
      overlayAnchor.style.position = 'fixed';
      overlayAnchor.style.left = '0';
      overlayAnchor.style.top = '0';
      overlayAnchor.style.zIndex = '1000';
      platform.BODY.appendChild(overlayAnchor);
    }
  },
};