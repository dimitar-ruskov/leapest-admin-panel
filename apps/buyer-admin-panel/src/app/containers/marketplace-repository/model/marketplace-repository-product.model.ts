import {
  IAccount, IConfiguration, IProductDetails,
  IProductPromotionalMaterial, IProductRestriction,
  IProductVariant,
  IProductVideo
} from "../../../../../../../libs/shared/src/lib/models/interfaces";


export interface IMarketplaceProduct {
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

export interface IApolloResp {
  products: IMarketplaceProduct[];
  metadata: { totalCount: number };
}
