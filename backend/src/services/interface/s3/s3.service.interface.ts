export interface IuploadServise {
  uploadFile(
    file: Express.Multer.File | Express.Multer.File[],
    folder: string
  ): Promise<
    | { success: boolean; Location: string }
    | { success: boolean; Location: string }[]
  >;
}
