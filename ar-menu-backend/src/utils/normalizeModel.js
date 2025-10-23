import { Document, NodeIO } from '@gltf-transform/core';
import { center, getBounds } from '@gltf-transform/functions';
import { KHRDracoMeshCompression } from '@gltf-transform/extensions';
import draco3d from 'draco3dgltf';

// Create the IO instance
const io = new NodeIO().registerExtensions([KHRDracoMeshCompression]);

/**
 * Normalizes a GLB model buffer: centers it and rescales it.
 * @param {Buffer} inputGlbBuffer - The original GLB file data.
 * @param {number} targetSize - The desired maximum size in meters (e.g., 0.2 for 20cm).
 * @returns {Promise<Buffer>} - Buffer of the normalized GLB file.
 */
export const normalizeAndRescaleGlb = async (inputGlbBuffer, targetSize = 0.2) => {
  try {
    console.log(`[Normalize] Reading GLB (Size: ${inputGlbBuffer.length} bytes)...`);

    // Load Draco dependencies
    console.log("[Normalize] Loading Draco dependencies...");
    await io.registerDependencies({
        'draco3d.decoder': await draco3d.createDecoderModule(),
        'draco3d.encoder': await draco3d.createEncoderModule(),
    });
    console.log("[Normalize] Draco dependencies loaded.");

    const document = await io.readBinary(inputGlbBuffer);
    const scene = document.getRoot().getDefaultScene();
    if (!scene) throw new Error('No default scene found.');

    // Center the model
    console.log(`[Normalize] Centering...`);
    await document.transform(center({ pivot: 'center' }));

    // Get current bounds to calculate scale factor
    const bbox = getBounds(scene);
    const size = {
      x: bbox.max[0] - bbox.min[0],
      y: bbox.max[1] - bbox.min[1],
      z: bbox.max[2] - bbox.min[2]
    };
    
    // Find the largest dimension
    const maxSize = Math.max(size.x, size.y, size.z);
    const scaleFactor = targetSize / maxSize;
    
    console.log(`[Normalize] Current max size: ${maxSize.toFixed(4)}m, Scale factor: ${scaleFactor.toFixed(4)}`);
    console.log(`[Normalize] Rescaling to fit ${targetSize}m...`);

    // Manual scaling by transforming all nodes
    for (const node of document.getRoot().listNodes()) {
      const currentScale = node.getScale();
      node.setScale([
        currentScale[0] * scaleFactor,
        currentScale[1] * scaleFactor,
        currentScale[2] * scaleFactor
      ]);
      
      const currentTranslation = node.getTranslation();
      node.setTranslation([
        currentTranslation[0] * scaleFactor,
        currentTranslation[1] * scaleFactor,
        currentTranslation[2] * scaleFactor
      ]);
    }

    console.log(`[Normalize] Writing normalized GLB...`);
    const outputGlbBuffer = await io.writeBinary(document);
    console.log(`[Normalize] Complete (New Size: ${outputGlbBuffer.length} bytes).`);

    return outputGlbBuffer;
  } catch (error) {
    console.error('[Normalize] Error:', error);
    throw new Error(`Failed to normalize GLB: ${error.message}`);
  }
};
