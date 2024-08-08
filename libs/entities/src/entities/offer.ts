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
    return {
      offerId: offerPair[0].toNumber(),
      creator: offerPair[1].creator.valueOf().toString(),
      acceptedAddress: offerPair[1].accepted_address.valueOf().toString(),
      offeredPayment: {
        tokenIdentifier: offerPair[1].offered_payment.token_identifier,
        amount: offerPair[1].offered_payment.amount.toFixed(0),
        nonce: offerPair[1].offered_payment.nonce.toNumber(),
      },
      acceptedPaymenet: {
        tokenIdentifier: offerPair[1].accepted_payment.token_identifier,
        amount: offerPair[1].accepted_payment.amount.toFixed(0),
        nonce: offerPair[1].accepted_payment.nonce.toNumber(),
      },
    } as Offer;
  }
}
