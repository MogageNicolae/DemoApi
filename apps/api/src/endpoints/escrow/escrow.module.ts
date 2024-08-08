import { Module } from '@nestjs/common';
import { EscrowController } from './escrow.controller';
import { ServicesModule } from '@libs/services';
import { DynamicModuleUtils } from '@libs/common';

@Module({
  imports: [ServicesModule,
    DynamicModuleUtils.getCachingModule(),
  ],
  providers: [
    DynamicModuleUtils.getNestJsApiConfigService()
  ],
  controllers: [EscrowController],
})
export class EscrowModule {}
