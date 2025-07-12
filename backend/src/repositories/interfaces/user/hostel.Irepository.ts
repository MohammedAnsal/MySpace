import { IHostel } from "../../../models/provider/hostel.model";
import { HostelFilters } from "../../../types/filters";
import mongoose from "mongoose";

export interface IHostelRepository {
  getHostelById(hostelId: string): Promise<IHostel | null>;
  findHostelByIdUnPopulated(hostelId: string): Promise<IHostel | null>
  getVerifiedHostelsForHome(): Promise<IHostel[]>;
  getVerifiedHostels(filters: HostelFilters): Promise<IHostel[]>;
  updateHostelAvailableSpace(hostelId: string): Promise<IHostel | null>
  getNearbyHostels(latitude: number, longitude: number, maxDistance: number): Promise<IHostel[]>;
  
  // Transaction methods for atomic booking operations
  getHostelByIdWithLock(hostelId: string, session: mongoose.ClientSession): Promise<IHostel | null>;
  decreaseAvailableSpace(hostelId: string, session: mongoose.ClientSession): Promise<IHostel | null>;
}
