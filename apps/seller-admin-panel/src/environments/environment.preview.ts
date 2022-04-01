export const environment = {
  production: true,
  name: 'preview',
  host: 'leapestpreview.com',
  saharaUrl: 'https://my.leapestpreview.com',
  instructorMarketUrl: 'https://instructors.leapestpreview.com',

  amberBaseUrl: 'https://amber.leapestpreview.com',
  amberUrl: 'https://amber.leapestpreview.com/api',
  bouncerUrl: 'https://account.leapestpreview.com',
  sphinxUrl: 'https://downloads.leapestpreview.com',
  intershopUrl: 'https://leapestpreview.com',
  uploadsBucket: 'leap-preview-product-marketplace-uploads',
  s3Storage: 'leap-preview-uploads',
  umbrellaUploadsBucket: 'leap-preview-umbrella',

  aws: {
    key: 'AKIAWLQHGLXHE6ZVEZWE',
    s3Url: 'https://s3-eu-west-1.amazonaws.com',
    sellerProductUploadsBucket: 'leap-preview-public-product-images',
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
  virgoEndpoint: 'https://amber.leapestpreview.com/api/virgo/graphql',
  graphqlEndpoint: 'https://amber.leapestpreview.com/api/bazaar/graphql',
};
