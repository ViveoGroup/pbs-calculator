declare module "fees" {
    export const DispensingFees: {
        ReadyPrepared: number;
        DangerousDrugFee: number;
        ExtemporaneouslyPrepared: number;
        AllowableAdditionalPatientCharge: number;
    };
    export function getWholesaleMarkup(aemp: number): number;
    export function getAHIFee(priceToPharmacistsForMaxQuantity: number): number;
    export const AdditionalFeesForSafetyNetPrices: {
        ReadyPrepared: number;
        ExtemporaneouslyPrepared: number;
    };
    export const EfficientFundingOfChemotherapy: {
        PreparationFee: number;
        DistributionFee: number;
        DiluentFee: number;
    };
    export const PatientCoPaymentAmounts: {
        General: number;
        Concessional: number;
    };
    export const SafetyNetThresholds: {
        General: number;
        Concessional: number;
    };
    export const SafetyNetCardIssueFee = 11.42;
}
declare module "calculator" {
    export function getPriceToPharmacy(aemp: number): number;
    export function getPackSizeQuantityFactor(packSize: number, maxQuantity: number): number;
    export interface ICalculateDPMQInput {
        aemp: number;
        maxQuantity: number;
        packSize: number;
        isDangerousDrug?: boolean;
        brandPremium?: number;
        isExtemporaneouslyPrepared?: boolean;
    }
    export function calculateDPMQ({ aemp, maxQuantity, packSize, isDangerousDrug, isExtemporaneouslyPrepared, brandPremium, }: ICalculateDPMQInput): number;
    export interface ICalculatePBSPriceInput {
        dpmq: number;
        isConcessional?: boolean;
        includeAllowableDiscount?: boolean;
        isExtemporaneouslyPrepared?: boolean;
        isSafetyNet?: boolean;
    }
    export function getPBSPrice({ dpmq, isConcessional, isSafetyNet, includeAllowableDiscount, }: ICalculatePBSPriceInput): number;
}
declare module "index" {
    export * as Fees from "fees";
    export * as Calculator from "calculator";
}
