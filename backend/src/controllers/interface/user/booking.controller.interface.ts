import { Request, Response } from "express";

export interface IBookingController {
  createBooking(req: Request, res: Response): Promise<void>;
  // getBookingDetails(req: Request, res: Response): Promise<void>;
  // getUserBookings(req: Request, res: Response): Promise<void>;
  // getHostelBookings(req: Request, res: Response): Promise<void>;
  // updateBooking(req: Request, res: Response): Promise<void>;
  // cancelBooking(req: Request, res: Response): Promise<void>;
  // processPayment(req: Request, res: Response): Promise<void>;
  checkAvailability(req: Request, res: Response): Promise<void>;
}
