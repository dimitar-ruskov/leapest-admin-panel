import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root',
})
export class EnvironmentService {
  public get baseUrl(): string {
    return document.location.origin;
  }

  public get amberUrl(): string {
    return environment.amberUrl;
  }

  public get saharaUrl(): string {
    return environment.saharaUrl;
  }

  public getBrandedPortalName(domain: string): string {
    const location = document.location;
    const address = `${location.protocol}//${domain}.${environment.host}`;
    return location.port ? address + ':' + location.port : address;
  }

  public get instructorMarketUrl(): string {
    return environment.instructorMarketUrl;
  }

  public get bouncerUrl(): string {
    return environment.bouncerUrl;
  }

  get adyenClientKey(): string {
    return environment.adyen.clientKey;
  }

  get graphqlEndpoint(): string {
    return environment.graphqlEndpoint;
  }

  get virgoEndpoint(): string {
    return environment.virgoEndpoint;
  }

  get assetsPath(): string {
    return environment.assetsPath;
  }

  get amberBaseUrl(): string {
    return environment.amberBaseUrl;
  }

  get sphinxUrl(): string {
    return environment.sphinxUrl;
  }

  public get defaultProfilePhotoUrl(): string {
    return 'https://s3-eu-west-1.amazonaws.com/itpx-cdn/images/instructors/default-profile-photo.svg';
  }

  public get s3Url(): string {
    return environment.aws.s3Url;
  }

  public isProdOrPreview(): boolean {
    return environment.production;
  }

  public get envName(): string {
    return environment.name;
  }

  public get s3Storage(): string {
    return environment.s3Storage;
  }

  public get umbrellaUploadsBucket(): string {
    return environment.umbrellaUploadsBucket;
  }

  public get aws(): any {
    return environment.aws;
  }

  public get paytmMerchant(): any {
    return environment.paytm.merchant;
  }

  get paytmUrl(): string {
    return environment.paytm.url;
  }

  public get isProdin(): boolean {
    const baseUrl = new URL(window.location.href);
    const [domain] = baseUrl.host.split('.');
    return this.envName === 'prodin' || domain === 'futureskillsprime';
  }

  public get isTest(): boolean {
    return this.envName === 'test';
  }
}
