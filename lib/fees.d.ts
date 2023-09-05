/**
 * Fees as at 1 July 2023.
 * For more information, visit https://www.pbs.gov.au/info/healthpro/explanatory-notes/front/fee
 */
export declare const DispensingFees: {
    ReadyPrepared: number;
    DangerousDrugFee: number;
    ExtemporaneouslyPrepared: number;
    AllowableAdditionalPatientCharge: number;
};
export declare function getWholesaleMarkup(aemp: number): number;
export declare function getAHIFee(priceToPharmacistsForMaxQuantity: number): number;
export declare const AdditionalFees: {
    ReadyPrepared: number;
    ExtemporaneouslyPrepared: number;
};
export declare const EfficientFundingOfChemotherapy: {
    PreparationFee: number;
    DistributionFee: number;
    DiluentFee: number;
};
export declare const PatientCoPaymentAmounts: {
    General: number;
    Concessional: number;
};
export declare const SafetyNetThresholds: {
    General: number;
    Concessional: number;
};
export declare const SafetyNetCardIssueFee = 11.42;
