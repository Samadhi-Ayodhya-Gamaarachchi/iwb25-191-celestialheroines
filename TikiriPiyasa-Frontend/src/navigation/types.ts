export type RootStackParamList = {
  Home: undefined;
  Search: undefined;
  Cart: undefined;
  Orders: undefined;
  Profile: undefined;
  EditProfile: undefined;
  Request: undefined;
  Children: undefined;              // NEW list screen
  ChildDetails: { childId: string };// NEW details screen
  Parents?: undefined;              // (optional parents list)
};