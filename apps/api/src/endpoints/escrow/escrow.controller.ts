import { Body, Post} from "@nestjs/common";
import { CreateOfferRequest } from "@libs/entities/entities/create.offer.request";
import { AcceptOfferRequest } from "@libs/entities/entities/accept.offer.request";
import { CancelOfferRequest } from "@libs/entities/entities/cancel.offer.request";
import { Offer } from '@libs/entities/entities/offer';
import { EscrowService } from '@libs/services/escrow/escrow.service';
import { Controller, Get, UseGuards } from '@nestjs/common';
import {NativeAuth, NativeAuthGuard} from "@multiversx/sdk-nestjs-auth";

@Controller()
@UseGuards(NativeAuthGuard)
export class EscrowController {
  constructor(private readonly escrowService: EscrowService) {}

  @Post('/escrow/offers/create')
  generateCreatedOfferTransaction(
    @NativeAuth('address') address: string,
    @Body() body: CreateOfferRequest,
  ): any {
    return this.escrowService.generateCreatedOfferTransaction(address, body);
  }

  @Post('/escrow/offers/accept')
  generateAcceptOfferTransaction(
    @NativeAuth('address') address: string,
    @Body() body: AcceptOfferRequest,
  ): any {
    return this.escrowService.generateAcceptOfferTransaction(address, body);
  }

  @Post('/escrow/offers/cancel')
  generateCancelOfferTransaction(
    @NativeAuth('address') address: string,
    @Body() body: CancelOfferRequest,
  ): any {
    return this.escrowService.generateCancelOfferTransaction(address, body);
  }

  @Get('escrow/offers/created')
  async getCreatedOffers(
    @NativeAuth('address') address: string
  ): Promise<Offer[]> {
    return await this.escrowService.getCreatedOffers(
      address,
    );
  }

  @Get('escrow/offers/wanted')
  async getWantedOffers(
    @NativeAuth('address') address: string
  ): Promise<Offer[]> {
    return await this.escrowService.getWantedOffers(
      address
    );
  }
}
