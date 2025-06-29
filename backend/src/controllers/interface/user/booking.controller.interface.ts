import { Response } from "express";
import { AuthRequset } from "../../../types/api";

export interface IBookingController {
  createBooking(req: AuthRequset, res: Response): Promise<Response>;
  getBookingDetails(req: AuthRequset, res: Response): Promise<Response>;
  getProviderBookings(req: AuthRequset, res: Response): Promise<Response>;
  getUserBookings(req: AuthRequset, res: Response): Promise<Response>;
  getAllBookings(req: AuthRequset, res: Response): Promise<Response>;
  cancelBooking(req: AuthRequset, res: Response): Promise<Response>;
}
