interface IS3service {
  uploadFile(
    file: Express.Multer.File | Express.Multer.File[],
    folder: string
  ): Promise<
    | { success: boolean; Location: string }
    | { success: boolean; Location: string }[]
  >;
  uploadMultipleFiles(
    files: Express.Multer.File[],
    folder: string
  ): Promise<{ success: boolean; Location: string }[]>;
  delete_File(files: string[]): Promise<boolean>;
  generateSignedUrl(url: string): Promise<string>;
}

export default IS3service