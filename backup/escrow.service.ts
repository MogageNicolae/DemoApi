import { AbiRegistry, Address, QueryRunnerAdapter, SmartContractQueriesController } from "@multiversx/sdk-core/out";
import { Injectable } from "@nestjs/common";
import abiRow from "./nft-escrow.abi.json";
import {ApiNetworkProvider} from "@multiversx/sdk-network-providers";
import { CommonConfigService } from "@libs/common";
import { Offer } from "@libs/entities/entities/offer";

@Injectable()
export class EscrowService{

    private readonly queriesController: SmartContractQueriesController;

    constructor(
         commonConfigService: CommonConfigService
    ){
        const abi = AbiRegistry.create(abiRow);
        const queryRunner = new QueryRunnerAdapter({
            networkProvider: new ApiNetworkProvider(commonConfigService.config.urls.api),
        });

        this.queriesController = new SmartContractQueriesController({
            abi,
            queryRunner
        })
    }
    public async getCreatedOffers(address: string): Promise<Offer[]>{
        const query = this.queriesController.createQuery({
            contract: "erd1qqqqqqqqqqqqqpgq8cpdy5cc4vurpecdspxcxwjmkcceh7n3dy7slx6ylm",
            function: "getCreatedOffers",
            arguments: [
                 new Address(address)
            ]
        });
        
        const response = await this.queriesController.runQuery(query);
        const [offersPairs] = this.queriesController.parseQueryResponse(response);

        console.log(offersPairs);
        
        return [];
    }

}