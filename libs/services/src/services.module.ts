import { Global, Module } from '@nestjs/common';
import { DatabaseModule } from '@libs/database';
import { DynamicModuleUtils, NetworkConfigModule } from '@libs/common';
import { EscrowService } from './escrow/escrow.service';

@Global()
@Module({
  imports: [
    NetworkConfigModule,
    DatabaseModule,
    DynamicModuleUtils.getCachingModule(),
  ],
  providers: [EscrowService],
  exports: [EscrowService],
})
export class ServicesModule {}
