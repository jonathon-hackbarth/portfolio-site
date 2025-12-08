import sharp from 'sharp';
import { writeFileSync } from 'fs';

// Read the webp image and convert to ico with circular styling
const webpPath = './public/og-image.webp';
const icoPath = './public/favicon.ico';

async function generateFavicon() {
  try {
    // Create a circular favicon with a black border
    // Size: 64x64 for better quality
    const size = 64;
    const borderWidth = 2;
    const borderColor = '#000000'; // Black stroke
    
    // Create SVG overlay for circular mask and border
    const svg = `
      <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
        <!-- Background circle -->
        <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2 - borderWidth / 2}" fill="white" stroke="${borderColor}" stroke-width="${borderWidth}"/>
        <!-- Image will be composited on top -->
      </svg>
    `;

    // First, resize and create circular image
    const resizedImage = await sharp(webpPath)
      .resize(size - borderWidth * 2, size - borderWidth * 2, { 
        fit: 'cover',
        position: 'center'
      })
      .png()
      .toBuffer();

    // Create the circular favicon with border using composite
    const favicon = await sharp({
      create: {
        width: size,
        height: size,
        channels: 4,
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      }
    })
      .composite([
        {
          input: resizedImage,
          left: borderWidth,
          top: borderWidth
        }
      ])
      .png()
      .toBuffer();

    // For a proper circular look with border, create with SVG
    const circularSvg = `
      <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <defs>
          <clipPath id="circleClip">
            <circle cx="${size / 2}" cy="${size / 2}" r="${(size - borderWidth) / 2}"/>
          </clipPath>
        </defs>
        <!-- Image clipped to circle -->
        <image xlink:href="data:image/png;base64,${favicon.toString('base64')}" width="${size}" height="${size}" x="0" y="0" clip-path="url(#circleClip)"/>
        <!-- Border circle -->
        <circle cx="${size / 2}" cy="${size / 2}" r="${(size - borderWidth / 2) / 2}" fill="none" stroke="${borderColor}" stroke-width="${borderWidth}"/>
      </svg>
    `;

    const svgBuffer = Buffer.from(circularSvg);
    const finalFavicon = await sharp(svgBuffer)
      .resize(size, size, { fit: 'contain' })
      .png()
      .toBuffer();

    writeFileSync(icoPath, finalFavicon);
    console.log(`✓ Circular favicon created at ${icoPath} (${size}x${size}px with black border)`);
  } catch (error) {
    console.error('Error generating favicon:', error);
    process.exit(1);
  }
}

generateFavicon();
