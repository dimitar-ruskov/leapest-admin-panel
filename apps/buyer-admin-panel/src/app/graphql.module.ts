import { NgModule } from '@angular/core';
import {APOLLO_OPTIONS} from 'apollo-angular';
import {HttpLink} from 'apollo-angular/http';
import {InMemoryCache, ApolloLink, from} from '@apollo/client/core';
import {setContext} from '@apollo/client/link/context';
import { OktaAuthStateService } from '@okta/okta-angular';
import {EnvironmentService} from "../../../../libs/shared/src/lib/services/common";

async function getOktaAccessToken(oktaAuthStateService: OktaAuthStateService): Promise<string> {
  const accessToken = (await oktaAuthStateService['oktaAuth'].tokenManager.get('accessToken'))?.accessToken;
  return accessToken;
}
export function createApollo(
  httpLink: HttpLink,
  environmentService: EnvironmentService,
  oktaAuthStateService: OktaAuthStateService,
) {
  const defaultLink = httpLink.create({ uri: environmentService.graphqlEndpoint });
  const virgoLink = httpLink.create({ uri: environmentService.virgoEndpoint });

  const selectedLink = ApolloLink.split(
    (operation) => operation.getContext().endpoint === 'virgo',
    virgoLink, // <= apollo will send to this if endpoint is 'virgo'
    defaultLink, // <= otherwise will send to this
  );

  const auth = setContext(async (operation, context) => {
    const accessToken = await getOktaAccessToken(oktaAuthStateService);

    if (accessToken === null) {
      return {};
    } else {
      return {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
    }
  });

  return {
    link: from([auth, selectedLink]),
    cache: new InMemoryCache(),
  };
}

@NgModule({
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink, EnvironmentService, OktaAuthStateService],
    },
  ],
})
export class GraphQLModule {}
