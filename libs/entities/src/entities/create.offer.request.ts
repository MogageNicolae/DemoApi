import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString} from "class-validator";

export class CreateOfferRequest {
    @ApiProperty()
    @IsString()
    wantedNFT!: string;

    @ApiProperty()
    @IsNumber()
    wantedNonce!: number;

    @ApiProperty()
    @IsString()
    wantedAddress!: string;

    @ApiProperty()
    @IsString()
    acceptedToken!: string;

    @ApiProperty()
    @IsNumber()
    acceptedAmount!: number;

}