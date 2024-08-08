import { Offer } from "@libs/entities/entities/offer";
import { Controller, Get } from "@nestjs/common";
import { EscrowService } from "@libs/services/escrow/escrow.service";

@Controller()
export class EscrowController {
    constructor(
        private readonly escrowService: EscrowService,
    ) {

    }

    @Get("/escrow/offers/created")
    async getCreatedOffers(): Promise<Offer[]> {
        return await this.escrowService.getCreatedOffers("erd13x29rvmp4qlgn4emgztd8jgvyzdj0p6vn37tqxas3v9mfhq4dy7shalqrx");
    }
}