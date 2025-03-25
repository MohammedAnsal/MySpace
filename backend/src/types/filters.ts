export interface HostelFilters {
  minPrice?: number;
  maxPrice?: number;
  gender?: string;
  amenities?: string[];
  search?: string;
  sortBy?: 'asc' | 'desc';
} 