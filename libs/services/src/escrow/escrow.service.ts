import { Offer } from '@libs/entities/entities/offer';
import { CreateOfferRequest } from '@libs/entities/entities/create.offer.request';
import { AcceptOfferRequest } from '@libs/entities/entities/accept.offer.request';
import {
  AbiRegistry,
  Address,
  QueryRunnerAdapter,
  SmartContractQueriesController,
  SmartContractTransactionsFactory,
  Token,
  TokenTransfer,
  TransactionsFactoryConfig,
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
  private readonly transactionsFactory: SmartContractTransactionsFactory;

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

    this.transactionsFactory = new SmartContractTransactionsFactory({
      config: new TransactionsFactoryConfig({
        chainID: networkConfigService.config.chainID,
      }),
      abi,
    });
  }

  public generateCreatedOfferTransaction(
    address: string,
    body: CreateOfferRequest,
  ): any {
    const transaction = this.transactionsFactory
      .createTransactionForExecute({
        sender: Address.fromBech32(address),
        contract: Address.fromBech32(
          this.networkConfigService.config.escrowContract,
        ),
        function: 'escrow',
        gasLimit: BigInt(10_000_000),
        arguments: [body.wantedNFT, body.wantedNonce, body.wantedAddress],
        tokenTransfers: [
          new TokenTransfer({
            token: new Token({ identifier: body.acceptedToken }),
            amount: BigInt(body.acceptedAmount),
          }),
        ],
      })
      .toPlainObject();
    return transaction;
  }

  public generateAcceptOfferTransaction(
    address: string,
    body: AcceptOfferRequest,
  ): any {
    const transaction = this.transactionsFactory
      .createTransactionForExecute({
        sender: Address.fromBech32(address),
        contract: Address.fromBech32(
          this.networkConfigService.config.escrowContract,
        ),
        function: 'accept',
        gasLimit: BigInt(10_000_000),
        arguments: [body.offerId],
        tokenTransfers: [
          new TokenTransfer({
            token: new Token({ identifier: body.paymentToken }),
            amount: BigInt(body.paymentAmount),
          }),
        ],
      })
      .toPlainObject();
    return transaction;
  }

  public generateCancelOfferTransaction(address: string, body: any): any {
    const transaction = this.transactionsFactory
      .createTransactionForExecute({
        sender: Address.fromBech32(address),
        contract: Address.fromBech32(
          this.networkConfigService.config.escrowContract,
        ),
        function: 'cancel',
        gasLimit: BigInt(10_000_000),
        arguments: [body.offerId],
      })
      .toPlainObject();
    return transaction;
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
