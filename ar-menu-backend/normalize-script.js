// normalize-script.js
import fs from 'fs/promises';
import path from 'path';
// Adjust the import path if your utils folder is elsewhere
import { normalizeAndRescaleGlb } from './src/utils/normalizeModel.js';

// Get arguments from command line: node normalize-script.js <input> [output] [size]
const inputFile = process.argv[2];
const outputFile = process.argv[3] || `normalized_${path.basename(inputFile)}`;
const targetSize = parseFloat(process.argv[4]) || 0.02; // Default 20cm

if (!inputFile) {
  console.error('Error: Input file path is required.');
  console.error('Usage: node normalize-script.js <input.glb> [output.glb] [targetSizeInMeters]');
  process.exit(1);
}

(async () => {
  try {
    console.log(`Reading input file: ${inputFile}`);
    const inputBuffer = await fs.readFile(inputFile);

    console.log(`Normalizing and rescaling model (Target size: ${targetSize}m)...`);
    const outputBuffer = await normalizeAndRescaleGlb(inputBuffer, targetSize);

    console.log(`Writing output file: ${outputFile}`);
    await fs.writeFile(outputFile, outputBuffer);

    console.log('\n✅ Normalization successful!');
  } catch (error) {
    console.error('\n❌ Script failed:', error);
    process.exit(1);
  }
})();