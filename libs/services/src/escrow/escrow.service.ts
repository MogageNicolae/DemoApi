import { AbiRegistry, Address, SmartContractTransactionsFactory, Token, TokenTransfer, TransactionsFactoryConfig } from '@multiversx/sdk-core/out';
import { Injectable } from '@nestjs/common';
import abiRow from './nft-escrow.abi.json';
import { CommonConfigService, NetworkConfigService } from '@libs/common';
import { CreateOfferRequest } from '@libs/entities/entities/create.offer.request';
import { AcceptOfferRequest } from '@libs/entities/entities/accept.offer.request';


@Injectable()
export class EscrowService {
    private readonly transactionsFactory: SmartContractTransactionsFactory;
    

    constructor (
        readonly commonConfigService: CommonConfigService,
        private readonly networkConfigService: NetworkConfigService,
    ) {
        const abi = AbiRegistry.create(abiRow);

        this.transactionsFactory = new SmartContractTransactionsFactory({
            config: new TransactionsFactoryConfig({chainID: networkConfigService.config.chainID}),
            abi
        });
    }

    public generateCreatedOfferTransaction(address: string, body: CreateOfferRequest): any {
        const transaction = this.transactionsFactory.createTransactionForExecute({
            sender: Address.fromBech32(address),
            contract: Address.fromBech32(this.networkConfigService.config.escrowContract),
            function: "escrow",
            gasLimit: BigInt(10_000_000),
            arguments: [
                body.wantedNFT,
                body.wantedNonce,
                body.wantedAddress
            ],
            tokenTransfers: [
                new TokenTransfer({
                    token: new Token({identifier: body.acceptedToken}),
                    amount: BigInt(body.acceptedAmount),
                })
            ]
        }).toPlainObject();
        return transaction;
    }

    public generateAcceptOfferTransaction(address: string, body: AcceptOfferRequest): any {
        const transaction = this.transactionsFactory.createTransactionForExecute({
            sender: Address.fromBech32(address),
            contract: Address.fromBech32(this.networkConfigService.config.escrowContract),
            function: "accept",
            gasLimit: BigInt(10_000_000),
            arguments: [
                body.offerId,
            ],
            tokenTransfers: [
                new TokenTransfer({
                    token: new Token({identifier: body.paymentToken}),
                    amount: BigInt(body.paymentAmount),
                })
            ]
        }).toPlainObject();
        return transaction;
    }

    public generateCancelOfferTransaction(address: string, body: any): any {
        const transaction = this.transactionsFactory.createTransactionForExecute({
            sender: Address.fromBech32(address),
            contract: Address.fromBech32(this.networkConfigService.config.escrowContract),
            function: "cancel",
            gasLimit: BigInt(10_000_000),
            arguments: [
                body.offerId,
            ]
        }).toPlainObject();
        return transaction;
    }

    
}