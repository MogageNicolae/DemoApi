import { CacheService } from '@multiversx/sdk-nestjs-cache';
import {
  AddressUtils,
  BinaryUtils,
  Locker,
} from '@multiversx/sdk-nestjs-common';
import { TransactionProcessor } from '@multiversx/sdk-transaction-processor';
import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import {
  CacheInfo,
  CommonConfigService,
  NetworkConfigService,
} from '@libs/common';
import { AppConfigService } from '../config/app-config.service';
import { ApiService } from '@multiversx/sdk-nestjs-http';
import e from 'express';

@Injectable()
export class ProcessorService {
  private transactionProcessor: TransactionProcessor =
    new TransactionProcessor();
  private readonly logger: Logger;

  constructor(
    private readonly cacheService: CacheService,
    private readonly commonConfigService: CommonConfigService,
    private readonly appConfigService: AppConfigService,
    private readonly networkConfigService: NetworkConfigService,
    private readonly apiService: ApiService,
  ) {
    this.logger = new Logger(ProcessorService.name);
  }

  @Cron('*/1 * * * * *')
  async handleNewTransactions() {
    await Locker.lock('newTransactions', async () => {
      await this.transactionProcessor.start({
        gatewayUrl: this.commonConfigService.config.urls.api,
        maxLookBehind: this.appConfigService.config.maxLookBehind,
        // eslint-disable-next-line require-await
        onTransactionsReceived: async (
          shardId,
          nonce,
          transactions,
          statistics,
        ) => {
          this.logger.log(
            `Received ${transactions.length} transactions on shard ${shardId} and nonce ${nonce}. Time left: ${statistics.secondsLeft}`,
          );

          const allInvalidatedKeys: string[] = [];

          for (const transaction of transactions) {
            const isEscrowTransaction =
              transaction.receiver ==
              this.networkConfigService.config.escrowContract;
            if (isEscrowTransaction && transaction.status === 'success') {
              const method = transaction.getDataFunctionName();

              switch (method) {
                case 'createOffer':
                  const createOfferKeys =
                    await this.handleCreateOfferTransaction(transaction);
                  allInvalidatedKeys.push(...createOfferKeys);

                  console.log('createOfferKeys', createOfferKeys);
                  break;
                case 'cancelOffer':
                  const cancelOfferKeys =
                    await this.handleCancelOfferTransaction(transaction);
                  allInvalidatedKeys.push(...cancelOfferKeys);

                  console.log('cancelOfferKeys', cancelOfferKeys);
                  break;
                case 'acceptOffer':
                  const acceptOfferKeys =
                    await this.handleAcceptOfferTransaction(transaction);
                  allInvalidatedKeys.push(...acceptOfferKeys);

                  console.log('acceptOfferKeys', acceptOfferKeys);
                  break;
              }
            }
          }

          const uniqueInvalidatedKeys = allInvalidatedKeys.distinct();
          if (uniqueInvalidatedKeys.length > 0) {
            await this.cacheService.deleteMany(uniqueInvalidatedKeys);
          }
        },
        getLastProcessedNonce: async (shardId) => {
          return await this.cacheService.getRemote(
            CacheInfo.LastProcessedNonce(shardId).key,
          );
        },
        setLastProcessedNonce: async (shardId, nonce) => {
          await this.cacheService.setRemote(
            CacheInfo.LastProcessedNonce(shardId).key,
            nonce,
            CacheInfo.LastProcessedNonce(shardId).ttl,
          );
        },
      });
    });
  }

  private async handleCreateOfferTransaction(
    transaction: any,
  ): Promise<string[]> {
    return this.handleOfferTransaction(transaction, 'createOffer');
  }

  private async handleCancelOfferTransaction(
    transaction: any,
  ): Promise<string[]> {
    return this.handleOfferTransaction(transaction, 'cancelOffer');
  }

  private async handleAcceptOfferTransaction(
    transaction: any,
  ): Promise<string[]> {
    return this.handleOfferTransaction(transaction, 'acceptOffer');
  }

  private async handleOfferTransaction(
    transaction: any,
    identifier: string,
  ): Promise<string[]> {
    console.log('Offer transaction ' + identifier, transaction);

    const transactionUrl = `${
      this.commonConfigService.config.urls.api
    }/transactions/${transaction.originalTransactionHash ?? transaction.hash}`;

    const { data: onChainTransaction } = await this.apiService.get(
      transactionUrl,
    );

    const offerEvent = onChainTransaction.logs?.events?.find(
      (e: any) => e.identifier === identifier,
    );
    if (!offerEvent) {
      return [];
    }

    const creatorAddressHex = BinaryUtils.base64ToHex(offerEvent.topics[1]);
    const buyerAddressHex = BinaryUtils.base64ToHex(offerEvent.topics[2]);

    const creatorAddress = AddressUtils.bech32Encode(creatorAddressHex);
    const buyerAddress = AddressUtils.bech32Encode(buyerAddressHex);

    console.log('Creator address', creatorAddress);
    console.log('Buyer address', buyerAddress);
    return [
      CacheInfo.CreatedOffers(creatorAddress).key,
      CacheInfo.WantedOffers(buyerAddress).key,
    ];
  }
}
