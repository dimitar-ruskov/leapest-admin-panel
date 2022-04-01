export const environment = {
  production: true,
  name: 'swat',
  host: 'mkp.edcastqa.in',
  saharaUrl: 'https://my.mkp.edcastqa.in',
  instructorMarketUrl: 'https://instructors.mkp.edcastqa.in',

  amberBaseUrl: 'https://amber.mkp.edcastqa.in',
  amberUrl: 'https://amber.mkp.edcastqa.in/api',
  bouncerUrl: 'https://account.mkp.edcastqa.in',
  sphinxUrl: 'https://downloads.mkp.edcastqa.in',
  intershopUrl: 'https://mkp.edcastqa.in',
  uploadsBucket: 'leap-swat-product-marketplace-uploads',
  s3Storage: 'leap-swat-uploads',
  umbrellaUploadsBucket: 'leap-swat-umbrella',

  aws: {
    key: 'AKIAWLQHGLXHE6ZVEZWE',
    s3Url: 'https://s3-ap-south-1.amazonaws.com',
    sellerProductUploadsBucket: 'leap-swat-public-product-images',
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
      logo: 'https://itpx-cdn.s3-ap-south-1.amazonaws.com/davinci/leapest-by-edcast-logo-small.svg',
      redirect: true,
    },
  },
  assetsPath: 'assets',
  virgoEndpoint: 'https://amber.mkp.edcastqa.in/api/virgo/graphql',
  graphqlEndpoint: 'https://amber.mkp.edcastqa.in/api/bazaar/graphql',
};
