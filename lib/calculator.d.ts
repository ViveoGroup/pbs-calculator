export declare function getPriceToPharmacy(aemp: number): number;
export declare function getPackSizeQuantityFactor(packSize: number, maxQuantity: number): number;
export interface ICalculateDPMQInput {
    aemp: number;
    maxQuantity: number;
    packSize: number;
    isDangerousDrug?: boolean;
    brandPremium?: number;
    isExtemporaneouslyPrepared?: boolean;
}
export declare function calculateDPMQ({ aemp, maxQuantity, packSize, isDangerousDrug, isExtemporaneouslyPrepared, brandPremium, }: ICalculateDPMQInput): number;
export interface ICalculatePBSPriceInput {
    dpmq: number;
    isConcessional?: boolean;
    includeAllowableDiscount?: boolean;
    isExtemporaneouslyPrepared?: boolean;
    isSafetyNet?: boolean;
    brandPremium?: number;
}
export declare function getPBSPrice({ dpmq, isConcessional, isSafetyNet, includeAllowableDiscount, brandPremium, }: ICalculatePBSPriceInput): number;
