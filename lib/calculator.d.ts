export interface ICalculateDispensedPriceInput {
    approvedExManufacturerPrice: number;
    maxQuantity: number;
    packSize: number;
    isDangerousDrug: boolean;
    brandPremium?: number;
}
export declare function getPriceToPharmacy(aemp: number): number;
export declare function getPackSizeQuantityFactor(packSize: number, maxQuantity: number): number;
export declare function getDispensedPriceForQuantity({ approvedExManufacturerPrice, maxQuantity, packSize, isDangerousDrug, brandPremium, }: ICalculateDispensedPriceInput): number;
export declare function getDiscountedPBSPrice(): void;
export interface ICalculatePBSPriceInput extends ICalculateDispensedPriceInput {
    includeAllowableDiscount: boolean;
}
export declare function getPBSPrice({ approvedExManufacturerPrice, includeAllowableDiscount, packSize, maxQuantity, isDangerousDrug, brandPremium, }: ICalculatePBSPriceInput): number;
export declare const SafetyNetPrice = 0;
