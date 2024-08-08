import { ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";

export class CancelOfferRequest {
    @ApiProperty()
    @IsNumber()
    offerId!: number;
}