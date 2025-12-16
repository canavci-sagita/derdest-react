/**
 * An extended HTMLElement interface that includes vendor-prefixed fullscreen methods.
 */
interface ElementWithFullscreen extends HTMLElement {
  mozRequestFullScreen?: () => Promise<void>;
  webkitRequestFullscreen?: () => Promise<void>;
  msRequestFullscreen?: () => Promise<void>;
}

/**
 * An extended Document interface that includes vendor-prefixed fullscreen properties and methods.
 */
interface DocumentWithFullscreen extends Document {
  mozCancelFullScreen?: () => Promise<void>;
  webkitExitFullscreen?: () => Promise<void>;
  msExitFullscreen?: () => Promise<void>;
  mozFullScreenElement?: Element | null;
  webkitFullscreenElement?: Element | null;
  msFullscreenElement?: Element | null;
}

const enter = (): void => {
  if (typeof document === "undefined") return;
  const el = document.documentElement as ElementWithFullscreen;
  if (el.requestFullscreen) {
    el.requestFullscreen();
  } else if (el.mozRequestFullScreen) {
    el.mozRequestFullScreen();
  } else if (el.webkitRequestFullscreen) {
    el.webkitRequestFullscreen();
  } else if (el.msRequestFullscreen) {
    el.msRequestFullscreen();
  }
};

const exit = (): void => {
  if (typeof document === "undefined") return;
  const doc = document as DocumentWithFullscreen;
  if (doc.exitFullscreen) {
    doc.exitFullscreen();
  } else if (doc.mozCancelFullScreen) {
    doc.mozCancelFullScreen();
  } else if (doc.webkitExitFullscreen) {
    doc.webkitExitFullscreen();
  } else if (doc.msExitFullscreen) {
    doc.msExitFullscreen();
  }
};

export const fullscreenUtils = {
  get isFullscreen(): boolean {
    if (typeof document === "undefined") {
      return false;
    }
    const doc = document as DocumentWithFullscreen;
    return !!(
      doc.fullscreenElement ||
      doc.mozFullScreenElement ||
      doc.webkitFullscreenElement ||
      doc.msFullscreenElement
    );
  },

  enter: enter,
  exit: exit,

  toggle(): void {
    if (this.isFullscreen) {
      this.exit();
    } else {
      this.enter();
    }
  },
};
