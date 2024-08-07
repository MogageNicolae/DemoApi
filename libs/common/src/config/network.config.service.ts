import { Injectable } from "@nestjs/common";
import { configuration } from "./configuration";

export interface NetworkConfig {
  chainID: 'D' | 'T' | '1';
  escrowContract: string;
}

@Injectable()
export class NetworkConfigService {
  private readonly devnetConfig: NetworkConfig = {
    chainID: 'D',
    escrowContract: 'erd1qqqqqqqqqqqqqpgq0gleu7dw80yp6r7ljyn2a3u4t5wwzksudy7sfjmg5y'
  };
  private readonly testnetConfig: NetworkConfig = {
    chainID: 'T',
    escrowContract: ''
  };
  private readonly mainnetConfig: NetworkConfig = {
    chainID: '1',
    escrowContract: ''
  };

  public readonly config: NetworkConfig;

  constructor() {
    const network = configuration().libs.common.network;

    const networkConfigs = {
      devnet: this.devnetConfig,
      testnet: this.testnetConfig,
      mainnet: this.mainnetConfig,
    };

    this.config = networkConfigs[network];
  }
}
