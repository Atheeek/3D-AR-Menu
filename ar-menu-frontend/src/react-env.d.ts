// This file tells TypeScript to recognize the <model-viewer> custom element and its properties.

declare namespace JSX {
  interface IntrinsicElements {
    'model-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      src?: string;
      'ios-src'?: string;
      scale?: string; // Correctly included
      alt?: string;
      ar?: boolean;
      'ar-modes'?: string;
      'camera-controls'?: boolean;
      'auto-rotate'?: boolean;
      'shadow-intensity'?: string;
      // Add environment-image and exposure if you plan to use them
      // 'environment-image'?: string;
      // exposure?: string;
      style?: React.CSSProperties;
    };
  }
}