import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class AcceptOfferRequest {
    @ApiProperty()
    @IsNumber()
    offerId!: number;

    @ApiProperty()
    @IsString()
    paymentToken!: string;

    @ApiProperty()
    @IsNumber()
    paymentAmount!: number;
}