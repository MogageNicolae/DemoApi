import { Offer } from '@libs/entities/entities/offer';
import {
  AbiRegistry,
  Address,
  QueryRunnerAdapter,
  SmartContractQueriesController,
} from '@multiversx/sdk-core/out';
import { Injectable } from '@nestjs/common';
import abiRow from './nft-escrow.abi.json';
import { ApiNetworkProvider } from '@multiversx/sdk-network-providers';
import {
  CacheInfo,
  CommonConfigService,
  NetworkConfigService,
} from '@libs/common';
import BigNumber from 'bignumber.js';
import { CacheService } from '@multiversx/sdk-nestjs-cache';

@Injectable()
export class EscrowService {
  readonly queriesController: SmartContractQueriesController;

  constructor(
    private readonly networkConfigService: NetworkConfigService,
    private readonly cachingService: CacheService,
    readonly commonConfigService: CommonConfigService,
  ) {
    const abi = AbiRegistry.create(abiRow);
    const queryRunner = new QueryRunnerAdapter({
      networkProvider: new ApiNetworkProvider(
        commonConfigService.config.urls.api,
      ),
    });

    this.queriesController = new SmartContractQueriesController({
      abi,
      queryRunner,
    });
  }

  public async getCreatedOffers(address: string): Promise<Offer[]> {
    return this.cachingService.getOrSet(
      CacheInfo.CreatedOffers(address).key,
      async () => await this.getCreatedOffersRaw(address),
      CacheInfo.CreatedOffers(address).ttl,
    );
  }

  public async getCreatedOffersRaw(address: string): Promise<Offer[]> {
    const query = this.queriesController.createQuery({
      contract: this.networkConfigService.config.escrowContract,
      function: 'getCreatedOffers',
      arguments: [new Address(address)],
    });

    const response = await this.queriesController.runQuery(query);
    const [offersPairs] = this.queriesController.parseQueryResponse(response);

    const offers: Offer[] = offersPairs
      .valueOf()
      .map((offerPair: [BigNumber, any]) => Offer.fromResponse(offerPair));

    console.log(offersPairs);

    return offers;
  }

  public async getWantedOffers(address: string): Promise<Offer[]> {
    return this.cachingService.getOrSet(
      CacheInfo.WantedOffers(address).key,
      async () => await this.getWantedOffersRaw(address),
      CacheInfo.WantedOffers(address).ttl,
    );
  }

  public async getWantedOffersRaw(address: string): Promise<Offer[]> {
    const query = this.queriesController.createQuery({
      contract: this.networkConfigService.config.escrowContract,
      function: 'getWantedOffers',
      arguments: [new Address(address)],
    });

    const response = await this.queriesController.runQuery(query);
    const [offersPairs] = this.queriesController.parseQueryResponse(response);

    const offers: Offer[] = offersPairs
      .valueOf()
      .map((offerPair: [BigNumber, any]) => Offer.fromResponse(offerPair));

    console.log(offersPairs);

    return offers;
  }
}
