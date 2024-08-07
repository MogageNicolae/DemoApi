import { Module } from "@nestjs/common";
import { EscrowController } from "./escrow.controller";
import { ServicesModule } from "@libs/services";

@Module({
    imports: [
        ServicesModule
    ],
    controllers: [
        EscrowController
    ],
    providers: []
})
export class EscrowModule {}