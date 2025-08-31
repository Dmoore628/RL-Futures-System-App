#!/usr/bin/env node

/**
 * Image Optimization Script for RL Futures Trading System
 * Optimizes images during build process for better performance
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const config = {
  inputDir: 'public',
  outputDir: 'dist',
  quality: 85,
  formats: ['jpg', 'jpeg', 'png', 'webp'],
  maxWidth: 1920,
  maxHeight: 1080,
};

// Check if sharp is available (image processing library)
function checkSharp() {
  try {
    require('sharp');
    return true;
  } catch (error) {
    console.log('Sharp not found. Installing...');
    try {
      execSync('npm install sharp --save-dev', { stdio: 'inherit' });
      return true;
    } catch (installError) {
      console.error('Failed to install sharp:', installError.message);
      return false;
    }
  }
}

// Optimize a single image
async function optimizeImage(inputPath, outputPath, format) {
  try {
    const sharp = require('sharp');
    
    let pipeline = sharp(inputPath)
      .resize(config.maxWidth, config.maxHeight, {
        fit: 'inside',
        withoutEnlargement: true,
      });
    
    switch (format) {
      case 'jpg':
      case 'jpeg':
        pipeline = pipeline.jpeg({ quality: config.quality, progressive: true });
        break;
      case 'png':
        pipeline = pipeline.png({ quality: config.quality, progressive: true });
        break;
      case 'webp':
        pipeline = pipeline.webp({ quality: config.quality });
        break;
    }
    
    await pipeline.toFile(outputPath);
    
    const inputStats = fs.statSync(inputPath);
    const outputStats = fs.statSync(outputPath);
    const savings = ((inputStats.size - outputStats.size) / inputStats.size * 100).toFixed(1);
    
    console.log(`✅ Optimized: ${path.basename(inputPath)} -> ${path.basename(outputPath)} (${savings}% smaller)`);
    
    return { success: true, savings };
  } catch (error) {
    console.error(`❌ Failed to optimize ${inputPath}:`, error.message);
    return { success: false, error: error.message };
  }
}

// Process all images in a directory
async function processImages(inputDir, outputDir) {
  if (!fs.existsSync(inputDir)) {
    console.log(`Input directory ${inputDir} does not exist. Skipping image optimization.`);
    return;
  }
  
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  const files = fs.readdirSync(inputDir);
  const imageFiles = files.filter(file => 
    config.formats.some(format => file.toLowerCase().endsWith(`.${format}`))
  );
  
  if (imageFiles.length === 0) {
    console.log('No image files found to optimize.');
    return;
  }
  
  console.log(`Found ${imageFiles.length} images to optimize...`);
  
  let totalSavings = 0;
  let successCount = 0;
  
  for (const file of imageFiles) {
    const inputPath = path.join(inputDir, file);
    const outputPath = path.join(outputDir, file);
    
    const format = path.extname(file).slice(1).toLowerCase();
    const result = await optimizeImage(inputPath, outputPath, format);
    
    if (result.success) {
      successCount++;
      totalSavings += result.savings;
    }
  }
  
  console.log(`\n🎉 Image optimization complete!`);
  console.log(`✅ Successfully optimized: ${successCount}/${imageFiles.length} images`);
  console.log(`💰 Average size reduction: ${(totalSavings / successCount).toFixed(1)}%`);
}

// Generate WebP versions for modern browsers
async function generateWebP(inputDir, outputDir) {
  try {
    const sharp = require('sharp');
    
    const files = fs.readdirSync(inputDir);
    const imageFiles = files.filter(file => 
      ['jpg', 'jpeg', 'png'].some(format => file.toLowerCase().endsWith(`.${format}`))
    );
    
    console.log(`\nGenerating WebP versions for ${imageFiles.length} images...`);
    
    for (const file of imageFiles) {
      const inputPath = path.join(inputDir, file);
      const webpName = path.basename(file, path.extname(file)) + '.webp';
      const outputPath = path.join(outputDir, webpName);
      
      try {
        await sharp(inputPath)
          .resize(config.maxWidth, config.maxHeight, {
            fit: 'inside',
            withoutEnlargement: true,
          })
          .webp({ quality: config.quality })
          .toFile(outputPath);
        
        console.log(`✅ Generated WebP: ${webpName}`);
      } catch (error) {
        console.error(`❌ Failed to generate WebP for ${file}:`, error.message);
      }
    }
  } catch (error) {
    console.error('Failed to generate WebP versions:', error.message);
  }
}

// Main execution
async function main() {
  console.log('🚀 Starting image optimization...');
  
  if (!checkSharp()) {
    console.error('❌ Sharp installation failed. Exiting.');
    process.exit(1);
  }
  
  try {
    await processImages(config.inputDir, config.outputDir);
    await generateWebP(config.inputDir, config.outputDir);
    
    console.log('\n✨ Image optimization pipeline complete!');
  } catch (error) {
    console.error('❌ Image optimization failed:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { optimizeImage, processImages, generateWebP };
