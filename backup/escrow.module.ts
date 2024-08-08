import { Module } from "@nestjs/common";
import { EscrowController } from "./escrow.controller";
import { ServicesModule } from "@libs/services";

@Module({
    imports:[
        ServicesModule
    ],
    providers:[],
    controllers:[
        EscrowController
    ]
})
export class EscrowModule{}