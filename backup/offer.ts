import { ApiProperty } from "@nestjs/swagger";

export class OfferPayment{
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
    acceptedPayment!: OfferPayment;

    
}