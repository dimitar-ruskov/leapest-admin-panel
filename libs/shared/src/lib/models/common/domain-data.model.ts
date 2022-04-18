export interface IDomainData {
  name: string;
  brandedPortalBanner: string;
  logo: string;
  alternatives: {
    createdAt: string;
    createdBy: string;
    id: string;
    isDefault: boolean;
    name: string;
    updatedAt: string;
    updatedBy: string;
  }[];
  buyerId: string;
  buyerName: string;
  createdAt: string;
  createdBy: string;
  details: any;
  grantAccess: boolean;
  hostName: string;
  id: string;
  landingTab: string;
  platformName: string;
  selfRegistration: boolean;
  updatedAt: string;
  updatedBy: string;
}
