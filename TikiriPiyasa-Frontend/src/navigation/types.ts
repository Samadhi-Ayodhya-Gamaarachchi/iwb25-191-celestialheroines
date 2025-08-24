export interface CenterProfile {
  centerName: string;
  registrationNumber: string;
  centerType: string;
  address: string;
  city: string;
  postalCode: string;
  mobileNumber: string;
  landlineNumber?: string;
  email: string;
  website?: string;
  socialMediaLinks?: string;
  weekdayHours?: string;
  weekendHours?: string;
  ageGroups?: string;
  maxCapacity?: string;
  staffCount?: string;
  specialPrograms?: string;
  certifications?: string;
  paymentMethods?: string;
  feeStructure?: string;
}

export type RootStackParamList = {
  Home: undefined;
  Search: undefined;
  Cart: undefined;
  Orders: undefined;
  Profile: undefined;
  EditProfile: Partial<CenterProfile> | undefined; // typed params
  Request: undefined;
  Children: undefined;              // NEW list screen
  ChildDetails: { childId: string };// NEW details screen
  Parents?: undefined;              // (optional parents list)
};