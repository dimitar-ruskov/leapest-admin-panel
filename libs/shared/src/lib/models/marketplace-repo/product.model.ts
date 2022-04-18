import { IAccount } from './account.model';
import {IConfigKeyValuePair} from "../common/dictionary.model";

export interface IProduct {
  id: string;
  sku: string;
  productVariants: IProductVariant[];
  seller: IAccount;
  longDescription?: string;
  details?: IProductDetails;
  restriction?: IProductRestriction;
  type?: string;
  promotionalMaterials: IProductPromotionalMaterial[];
  videos: IProductVideo[];
  currency: any;
  level: string;
  name: string;
  price: null;
  accessDuration: string;
  accessDurationType: IConfiguration;
  pricing: {
    amount: number;
    currency: string;
  };
  render: any;
  reviews: any[];
  shortDescription: string;
  suffix: string;
}

export interface IProductDetails {
  ipStatement: string;
  sellerStatement: string;
  courseInfo: IProductCourseInfo;
  examInfo: any;
  instructions: IProductInstructions;
  productSegment: IProductSegment;
}
export interface IProductSegment {
  code: string;
  name: string;
  sellerRole: string;
  sellerAccreditationStatus: string;
  trainerRequirements: string;
  restrictionMessage: string;
  accreditationRequirements: string;
  accreditationProcess: string;
  examInformation: string;
}

export interface IProductInstructions {
  prerequisites: string;
  examLocations: string;
  openBookExamRequirements: string;
  instructorRequirements: string;
  technicalRequirements: string;
}
export interface IProductCourseInfo {
  agenda: string;
  description: string;
  outline: string;
  learningObjectives: string;
  targetAudience: string;
  duration: number;
  durationType: string;
  prerequisites: string;
}
export interface IProductVariant {
  id: string;
  sku: string;
  deliveryFormat: string;
  deliveryFormatConfig: IConfigKeyValuePair;
  language: string;
  certificateType: string;
  defaultVariant: boolean | null;
  restrictedForLxpPurchase: boolean | null;
}
export interface IProductRestriction {
  restricted: boolean;
  hasAccess: boolean;
}

export interface IProductMedia {
  url: string;
  title: string;
  description: string;
}

export interface IProductPromotionalMaterial extends IProductMedia {
  fileName: string;
}

export interface IProductVideo extends IProductMedia {
  featured: boolean;
}

export interface IConfiguration {
  configKey: string;
  configValue: string;
  configType: string;
}
