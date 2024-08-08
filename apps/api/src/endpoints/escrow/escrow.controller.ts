import { EscrowService } from "@libs/services/escrow/escrow.service";
import {Body, Controller, Post, Query } from "@nestjs/common";
import { CreateOfferRequest } from "@libs/entities/entities/create.offer.request";
import { AcceptOfferRequest } from "@libs/entities/entities/accept.offer.request";
import { CancelOfferRequest } from "@libs/entities/entities/cancel.offer.request";

@Controller()
export class EscrowController {

    constructor (
        private readonly escrowService: EscrowService
     ) {}

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


}