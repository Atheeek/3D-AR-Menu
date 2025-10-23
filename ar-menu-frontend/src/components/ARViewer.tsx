'use client';
// import type {} from 'react/next-env'; // 👈 DELETE OR COMMENT OUT THIS LINE

interface ARViewerProps {
  modelUrl: string;
  iosModelUrl: string;
  itemName: string;
}

const ARViewer = ({ modelUrl, iosModelUrl, itemName }: ARViewerProps) => {
// const modelScale = "0.05 0.05 0.05"; // 5% of original

  return (
    <div className="w-full aspect-square relative bg-brand-dark rounded-t-lg overflow-hidden border-b border-gray-700/50">
      <model-viewer
        src={modelUrl}
        ios-src={iosModelUrl}
        alt={`A 3D model of ${itemName}`}
        // scale={modelScale}
        ar
        ar-modes="webxr scene-viewer quick-look"
        camera-controls
        auto-rotate
        shadow-intensity="1"
        style={{ width: '100%', height: '100%', backgroundColor: 'transparent' }}
      >
       <button
          slot="ar-button"
          className="absolute bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition-colors"
        >
          View in Your Space
        </button>
      </model-viewer>
    </div>
  );
};

export default ARViewer;