import Container, { Service } from "typedi";
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import IS3service from "../../interface/s3/s3.service.interface";
import { NodeHttpHandler } from "@aws-sdk/node-http-handler";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { AppError } from "../../../utils/error";
import { HttpStatus } from "../../../enums/http.status";
import { ImageOptimizationService } from "../../../utils/imageOptimization";

@Service()
export class s3Service implements IS3service {
  private s3Service: S3Client;
  private bucket: string;
  private imageOptimizationService: ImageOptimizationService;

  constructor() {
    this.s3Service = new S3Client({
      credentials: {
        accessKeyId: process.env.BUCKET_ACCESS_KEY || "",
        secretAccessKey: process.env.BUCKET_SECRET_KEY || "",
      },

      region: process.env.BUCKET_REGION || "",
      requestHandler: new NodeHttpHandler({
        connectionTimeout: 300000,
        socketTimeout: 300000,
      }),
    });

    this.bucket = process.env.BUCKET_NAME!;
    this.imageOptimizationService = new ImageOptimizationService();
  }

  //  For validate the file :-

  private validate_Files(file: Express.Multer.File) {
    if (file.size > 5 * 1024 * 1024)
      throw new AppError(
        "File size too large. Maximum size is 5MB",
        HttpStatus.BAD_REQUEST
      );

    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];

    if (!allowedTypes.includes(file.mimetype))
      throw new AppError(
        "Only image files are allowed",
        HttpStatus.BAD_REQUEST
      );
  }

  //  For upload multiple file's :-

  async uploadMultipleFiles(files: Express.Multer.File[], folder: string) {
    try {
      if (!files || files.length === 0) {
        throw new AppError("No files provided", HttpStatus.BAD_REQUEST);
      }

      files.forEach((file) => this.validate_Files(file));

      // Optimize images before upload
      const optimizedFiles =
        await this.imageOptimizationService.optimizeMultipleImages(files, {
          quality: 80,
          width: 1920,
          height: 1080,
          format: "jpeg",
        });

      const uploadPromises = optimizedFiles.map(async (file) => {
        const params = {
          Bucket: this.bucket,
          Key: `${folder}/${Date.now()}-${file.originalname}`,
          Body: file.buffer,
          ContentType: file.mimetype,
        };

        const command = new PutObjectCommand(params);
        await this.s3Service.send(command);

        return {
          success: true,
          Location: `https://${this.bucket}.s3.${process.env.BUCKET_REGION}.amazonaws.com/${params.Key}`,
        };
      });

      return await Promise.all(uploadPromises);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        "Failed to upload files",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  //  For upload single file :-

  async uploadFile(
    file: Express.Multer.File | Express.Multer.File[],
    folder: string
  ) {
    try {
      const images = Array.isArray(file) ? file : [file];

      images.forEach((img) => this.validate_Files(img));

      const results = await Promise.all(
        images.map(async (img) => {
          const params = {
            Bucket: process.env.BUCKET_NAME,
            Key: `${folder}/${Date.now()}-${img.originalname}`,
            Body: img.buffer,
            ContentType: img.mimetype,
          };

          const command = new PutObjectCommand(params);
          await this.s3Service.send(command);

          return {
            success: true,
            Location: `https://${process.env.BUCKET_NAME}.s3.${process.env.BUCKET_REGION}.amazonaws.com/${params.Key}`,
          };
        })
      );
      return Array.isArray(file) ? results : results[0];
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  //  For delete file :-

  async delete_File(files: string[]) {
    try {
      for (let url of files) {
        let key = url.split(".com/")[1];
        const params = {
          Bucket: process.env.BUCKET_NAME,
          Key: key,
        };
        const command = new DeleteObjectCommand(params);
        try {
          await this.s3Service.send(command);
        } catch (sendError) {
          throw new Error("Faield to delete");
        }
      }
      return true;
    } catch (error) {
      throw new Error("Error occured in delete file");
    }
  }

  //  For creating signedURL :-

  async generateSignedUrl(url: string): Promise<string> {
    try {
      if (!url) return "";

      let key;
      if (url.includes(".com/")) {
        key = url.split(".com/")[1];
      } else {
        key = url;
      }

      if (!key) return url;

      const expiresIn = 3600;
      const command = new GetObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });

      return await getSignedUrl(this.s3Service, command, { expiresIn });
    } catch (error) {
      console.error("Error generating signed URL:", error);
      return url;
    }
  }
}

export const S3Service = Container.get(s3Service);
