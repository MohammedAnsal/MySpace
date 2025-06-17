import { Response } from "express";
import { AuthRequset } from "../../../types/api";

export interface IBookingController {
  createBooking(req: AuthRequset, res: Response): Promise<void>;
  getBookingDetails(req: AuthRequset, res: Response): Promise<void>;
  getProviderBookings(req: AuthRequset, res: Response): Promise<void>;
  getUserBookings(req: AuthRequset, res: Response): Promise<void>;
  getAllBookings(req: AuthRequset, res: Response): Promise<void>;
  cancelBooking(req: AuthRequset, res: Response): Promise<void>;
}
