import {gql, Apollo} from 'apollo-angular';
import {ApolloQueryResult} from '@apollo/client/core';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { IApolloResp } from '../model/marketplace-repository-product.model';
import {IPageable, Sort} from "../../../../../../../libs/shared/src/lib/models/interfaces";


const LIST_PRODUCTS = gql`
  query listProducts($listing: ProductListingQuery!) {
    results: listProducts(listing: $listing) {
      products {
        id
        name
        sku
        typeConfig {
          configValue
          configKey
        }
        levelConfig {
          configValue
          configKey
        }
        courseDeliveryFormatsConfig {
          configValue
          configKey
        }
        shortDescription
        pricing {
          amount
          currency
        }
        suffix
        render {
          mediumImageUri
        }
        seller {
          displayName
          name
          logo
        }
        productVariants {
          id
          sku
          name
          language
          deliveryFormat
          certificateType
          defaultVariant
          renders {
            mediumImageUri
          }
          languageConfig {
            configValue
            configKey
          }
          deliveryFormatConfig {
            configValue
            configKey
          }
          certificateTypeConfig {
            configValue
            configKey
          }
          language
          deliveryFormat
          certificateType
        }
        restriction {
          restricted
          hasAccess
          isNotContractedSupplier
          accreditationSegments {
            code
            name
          }
        }
        publishedToLxp
        enabledForLxp
      }
      metadata {
        totalCount
        minPrice
        maxPrice
        aggregations {
          key
          items {
            key
            count
            displayValue
          }
        }
      }
    }
  }
`;

@Injectable()
export class MarketplaceRepositoryService {
  constructor(private readonly apollo: Apollo) {}

  list(pageable: IPageable, sort: Sort = {}): Observable<ApolloQueryResult<{ results: IApolloResp }>> {
    const sortObject: { sortField: string; sortDir: number } = {
      sortField: sort.key || 'best',
      sortDir: sort.order || -1,
    };

    const listing = {
      ...sortObject,
      ...pageable,
    };

    listing.page = listing.page - 1;

    return this.apollo.watchQuery({
      query: LIST_PRODUCTS,
      variables: { listing },
    }).valueChanges as Observable<ApolloQueryResult<{ results: IApolloResp }>>;
  }
}
