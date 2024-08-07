import { Constants } from '@multiversx/sdk-nestjs-common';

export class CacheInfo {
  key: string = '';
  ttl: number = Constants.oneSecond() * 6;

  static LastProcessedNonce(shardId: number): CacheInfo {
    return {
      key: `lastProcessedNonce:${shardId}`,
      ttl: Constants.oneMonth(),
    };
  }

  static Examples: CacheInfo = {
    key: 'examples',
    ttl: Constants.oneHour(),
  };

  static CreatedOffers(address: string): CacheInfo {
    return {
      key: `createdOffers:${address}`,
      ttl: Constants.oneHour(),
    };
  }

  static WantedOffers(address: string): CacheInfo {
    return {
      key: `wantedOffers:${address}`,
      ttl: Constants.oneHour(),
    };
  }
}
