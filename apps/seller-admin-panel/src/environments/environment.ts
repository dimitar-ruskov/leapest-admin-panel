export const environment = {
  production: false,
  name: 'test',
  host: 'itpx.one',
  saharaUrl: 'https://my.itpx.one',
  instructorMarketUrl: 'https://instructors.itpx.one',

  amberBaseUrl: 'https://amber.itpx.one',
  amberUrl: 'https://amber.itpx.one/api',
  bouncerUrl: 'https://account.itpx.one',
  sphinxUrl: 'https://downloads.itpx.one',
  intershopUrl: 'https://itpx.one',
  uploadsBucket: 'itpx-test-product-marketplace-uploads',
  s3Storage: 'itpx-test-uploads',
  umbrellaUploadsBucket: 'itpx-umbrella-test',

  aws: {
    key: 'AKIAQ6EHUBLEURAGLSUZ',
    s3Url: 'https://s3-eu-west-1.amazonaws.com',
    sellerProductUploadsBucket: 'itpx-public-product-images-test',
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
    clientKey: 'test_ZVI4LE36HVE2FCXGOAHXRIADDA7XNF5K',
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
  virgoEndpoint: 'https://amber.itpx.one/api/virgo/graphql',
  graphqlEndpoint: 'https://amber.itpx.one/api/bazaar/graphql',
};
