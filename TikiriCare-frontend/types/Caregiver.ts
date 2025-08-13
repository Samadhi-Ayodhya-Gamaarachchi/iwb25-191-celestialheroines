export type Caregiver = {
  id: string;
  name: string;
  location: string;
  slots: number;
  rating: number;
  photo: string;
  status: "available" | "pending" | "approved";
};
