export const environment = {
  production: true,
  name: 'prodin',
  host: 'edcastmarketplace.com',
  saharaUrl: 'https://my.edcastmarketplace.com',
  instructorMarketUrl: 'https://instructors.edcastmarketplace.com',

  amberBaseUrl: 'https://amber.edcastmarketplace.com',
  amberUrl: 'https://amber.edcastmarketplace.com/api',
  bouncerUrl: 'https://account.edcastmarketplace.com',
  sphinxUrl: 'https://downloads.edcastmarketplace.com',
  intershopUrl: 'https://edcastmarketplace.com',
  uploadsBucket: 'leap-prodin-product-marketplace-uploads',
  s3Storage: 'leap-prodin-uploads',
  umbrellaUploadsBucket: 'leap-prodin-umbrella',

  aws: {
    key: 'AKIAWLQHGLXHNG647C4K',
    s3Url: 'https://s3-ap-south-1.amazonaws.com',
    sellerProductUploadsBucket: 'leap-prodin-public-product-images',
    brandedPortalBucket: 'leap-prodin-branded-portal',
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
    clientKey: '',
  },
  paytm: {
    url: 'https://securegw.paytm.in/merchantpgpui/checkoutjs/merchants/',
    merchant: {
      mid: 'EdCast70221107846028',
      name: 'FutureSkills Prime',
      logo: 'https://s3-ap-south-1.amazonaws.com/leap-prodin-uploads/b671a22b42d5da4e75fd04be9211aff1.FS-prime.png',
      redirect: true,
    },
  },
  assetsPath: 'assets',
  virgoEndpoint: 'https://amber.edcastmarketplace.com/api/virgo/graphql',
  graphqlEndpoint: 'https://amber.edcastmarketplace.com/api/bazaar/graphql',
};
