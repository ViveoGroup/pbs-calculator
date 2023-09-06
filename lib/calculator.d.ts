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
export interface ICalculatePBSPriceFromAEMPInput extends ICalculateDPMQInput {
    includeAllowableDiscount: boolean;
    isConcessional?: boolean;
}
export declare function calculatePBSPriceFromAEMP({ aemp, includeAllowableDiscount, packSize, maxQuantity, isDangerousDrug, brandPremium, isExtemporaneouslyPrepared, isConcessional, }: ICalculatePBSPriceFromAEMPInput): number;
export interface ICalculatePBSPriceInput {
    dpmq: number;
    isConcessional?: boolean;
    includeAllowableDiscount?: boolean;
    isExtemporaneouslyPrepared?: boolean;
}
export declare function getPBSPrice({ dpmq, isConcessional, includeAllowableDiscount, }: ICalculatePBSPriceInput): number;
export interface ICalculateSafetyNetPriceInput extends ICalculatePBSPriceFromAEMPInput {
}
export declare function getSafetyNetPrice({ aemp, includeAllowableDiscount, packSize, maxQuantity, isDangerousDrug, brandPremium, isConcessional, isExtemporaneouslyPrepared, }: ICalculateSafetyNetPriceInput): void;
