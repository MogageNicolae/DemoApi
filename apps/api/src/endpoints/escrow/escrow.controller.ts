import { EscrowService } from "@libs/services/escrow/escrow.service";
import { Body, Controller, Post, Query, Get } from "@nestjs/common";
import { CreateOfferRequest } from "@libs/entities/entities/create.offer.request";
import { AcceptOfferRequest } from "@libs/entities/entities/accept.offer.request";
import { CancelOfferRequest } from "@libs/entities/entities/cancel.offer.request";
import { Offer } from '@libs/entities/entities/offer';

@Controller()
export class EscrowController {
  constructor(private readonly escrowService: EscrowService) {}

  @Post('/escrow/offers/create')
  generateCreatedOfferTransaction(
    @Query('address') address: string,
    @Body() body: CreateOfferRequest,
  ): any {
    return this.escrowService.generateCreatedOfferTransaction(address, body);
  }

  @Post('/escrow/offers/accept')
  generateAcceptOfferTransaction(
    @Query('address') address: string,
    @Body() body: AcceptOfferRequest,
  ): any {
    return this.escrowService.generateAcceptOfferTransaction(address, body);
  }

  @Post('/escrow/offers/cancel')
  generateCancelOfferTransaction(
    @Query('address') address: string,
    @Body() body: CancelOfferRequest,
  ): any {
    return this.escrowService.generateCancelOfferTransaction(address, body);
  }

  @Get('escrow/offers/created')
  async getCreatedOffers(): Promise<Offer[]> {
    return await this.escrowService.getCreatedOffers(
      'erd13x29rvmp4qlgn4emgztd8jgvyzdj0p6vn37tqxas3v9mfhq4dy7shalqrx',
    );
  }

  @Get('escrow/offers/wanted')
  async getWantedOffers(): Promise<Offer[]> {
    return await this.escrowService.getWantedOffers(
      'erd13x29rvmp4qlgn4emgztd8jgvyzdj0p6vn37tqxas3v9mfhq4dy7shalqrx',
    );
  }
}