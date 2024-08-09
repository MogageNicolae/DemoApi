import { ApiProperty } from '@nestjs/swagger';
import BigNumber from 'bignumber.js';

export class OfferPayment {
  @ApiProperty()
  tokenIdentifier!: string;

  @ApiProperty()
  amount!: string;

  @ApiProperty()
  nonce!: number;
}

export class Offer {
  @ApiProperty()
  offerId!: number;

  @ApiProperty()
  creator!: string;

  @ApiProperty()
  acceptedAddress!: string;

  @ApiProperty()
  offeredPayment!: OfferPayment;

  @ApiProperty()
  acceptedPaymenet!: OfferPayment;

  static fromResponse(offerPair: [BigNumber, any]): Offer {
    console.log(offerPair);
    return {
      offerId: offerPair[0].toNumber(),
      creator: offerPair[1].creator.valueOf().toString(),
      acceptedAddress: offerPair[1].wanted_address.valueOf().toString(),
      offeredPayment: {
        tokenIdentifier: offerPair[1].nft.valueOf().toString(),
        amount: '1',
        nonce: offerPair[1].nonce.toNumber(),
      },
      acceptedPaymenet: {
        tokenIdentifier: offerPair[1].wanted_nft.valueOf().toString(),
        amount: '1',
        nonce: offerPair[1].wanted_nonce.toNumber(),
      },
    } as Offer;
  }
}
