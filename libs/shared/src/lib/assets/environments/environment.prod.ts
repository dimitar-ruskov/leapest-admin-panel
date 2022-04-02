export const environment = {
  production: true,
  name: 'prod',
  host: 'leapest.com',
  saharaUrl: 'https://my.leapest.com',
  instructorMarketUrl: 'https://instructors.leapest.com',

  amberBaseUrl: 'https://iamber.leapest.com',
  amberUrl: 'https://iamber.leapest.com/api',
  bouncerUrl: 'https://account.leapest.com',
  sphinxUrl: 'https://downloads.leapest.com',
  intershopUrl: 'https://leapest.com',
  uploadsBucket: 'itpx-prod-product-marketplace-uploads',
  s3Storage: 'itpx-uploads',
  umbrellaUploadsBucket: 'itpx-umbrella',

  aws: {
    key: 'AKIAQ6EHUBLEURAGLSUZ',
    s3Url: 'https://s3-eu-west-1.amazonaws.com',
    sellerProductUploadsBucket: 'itpx-public-product-images-prod',
    brandedPortalBucket: 'itpx-branded-portal-dev',
  },

  adyen: {
    publicKey: `
      -----BEGIN PUBLIC KEY-----
      MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCisWT53qlVFdASFLwkvU3yMB4E
      ssq/8yUMI99kBiT04y96Ha6nHndZIt+H+jC0opBUzBNWuZ8xcmih8fZ7sj3nIRGe
      eHoAxKSWZVj4aOUWqP6GJCW0cnN2U93x1SLtKtHVbH3/OAlrWZ0sRAwrXT6ZKSIo
      5q6Gj8c0aqa45jcHSwIDAQAB
      -----END PUBLIC KEY-----
      `,
    clientKey: 'live_AB6UGXNCEBENTI45JT5EAO4ZTYMXYGVV',
  },
  paytm: {
    url: 'https://securegw-stage.paytm.in/merchantpgpui/checkoutjs/merchants/',
    merchant: {
      mid: 'EdCast83160718813342',
      name: 'EdCast Marketplace',
      logo: 'https://itpx-cdn.s3-eu-west-1.amazonaws.com/davinci/leapest-by-edcast-logo-small.svg',
      redirect: true,
    },
  },
  assetsPath: 'assets',
  virgoEndpoint: 'https://iamber.leapest.com/api/virgo/graphql',
  graphqlEndpoint: 'https://iamber.leapest.com/api/bazaar/graphql',
};
