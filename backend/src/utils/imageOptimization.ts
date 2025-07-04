import sharp from "sharp";
import { Service } from "typedi";

export interface OptimizationOptions {
  quality?: number;
  width?: number;
  height?: number;
  format?: "jpeg" | "png" | "webp";
  fit?: "cover" | "contain" | "fill" | "inside" | "outside";
}

@Service()
export class ImageOptimizationService {
  private defaultOptions: OptimizationOptions = {
    quality: 80,
    width: 1920,
    height: 1080,
    format: "jpeg",
    fit: "inside",
  };

  async optimizeImage(
    buffer: Buffer,
    options: Partial<OptimizationOptions> = {}
  ): Promise<{ buffer: Buffer; format: string; size: number }> {
    try {
      const opts = { ...this.defaultOptions, ...options };

      let sharpInstance = sharp(buffer);

      // Resize image
      if (opts.width || opts.height) {
        sharpInstance = sharpInstance.resize(opts.width, opts.height, {
          fit: opts.fit,
          withoutEnlargement: true,
        });
      }

      // Convert to specified format and optimize
      switch (opts.format) {
        case "webp":
          sharpInstance = sharpInstance.webp({ quality: opts.quality });
          break;
        case "png":
          sharpInstance = sharpInstance.png({ quality: opts.quality });
          break;
        default:
          sharpInstance = sharpInstance.jpeg({
            quality: opts.quality,
            progressive: true,
            mozjpeg: true,
          });
      }

      const optimizedBuffer = await sharpInstance.toBuffer();

      return {
        buffer: optimizedBuffer,
        format: `image/${opts.format}`,
        size: optimizedBuffer.length,
      };
    } catch (error) {
      console.error("Image optimization failed:", error);
      // Return original buffer if optimization fails
      return {
        buffer,
        format: "image/jpeg",
        size: buffer.length,
      };
    }
  }

  async optimizeMultipleImages(
    files: Express.Multer.File[],
    options: Partial<OptimizationOptions> = {}
  ): Promise<Express.Multer.File[]> {
    const optimizationPromises = files.map(async (file) => {
      const optimized = await this.optimizeImage(file.buffer, options);

      return {
        ...file,
        buffer: optimized.buffer,
        mimetype: optimized.format,
        size: optimized.size,
      };
    });

    return Promise.all(optimizationPromises);
  }

  async generateThumbnail(
    buffer: Buffer,
    width: number = 300,
    height: number = 300
  ): Promise<Buffer> {
    return sharp(buffer)
      .resize(width, height, { fit: "cover" })
      .jpeg({ quality: 70 })
      .toBuffer();
  }
}
