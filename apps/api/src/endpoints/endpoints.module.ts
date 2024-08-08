import { Module } from "@nestjs/common";
import { DynamicModuleUtils } from "@libs/common";
import { EscrowModule } from "./escrow/escrow.module";

@Module({
  imports: [
    EscrowModule
  ],
  providers: [
    DynamicModuleUtils.getNestJsApiConfigService(),
  ],
})
export class EndpointsModule { }
