export type Admin = {
  fullName: string | null;
  email: string | null;
  token: string | null;
  role: string | null;
};

export interface IFacilityData {
  name: string;
  price: number;
  status?: boolean;
  description?: string;
}
