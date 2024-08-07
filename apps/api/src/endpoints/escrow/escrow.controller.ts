import { Offer } from '@libs/entities/entities/offer';
import { EscrowService } from '@libs/services/escrow/escrow.service';
import { Controller, Get, UseGuards } from '@nestjs/common';
import {NativeAuth, NativeAuthGuard} from "@multiversx/sdk-nestjs-auth"

@Controller()
@UseGuards(NativeAuthGuard)
export class EscrowController {
  constructor(private readonly escrowService: EscrowService) {}

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