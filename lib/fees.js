"use strict";
/**
 * Fees as at 1 July 2023.
 * For more information, visit https://www.pbs.gov.au/info/healthpro/explanatory-notes/front/fee
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SafetyNetCardIssueFee = exports.SafetyNetThresholds = exports.PatientCoPaymentAmounts = exports.EfficientFundingOfChemotherapy = exports.AdditionalFeesForSafetyNetPrices = exports.getAHIFee = exports.getWholesaleMarkup = exports.DispensingFees = void 0;
const decimal_js_1 = require("decimal.js");
exports.DispensingFees = {
    ReadyPrepared: 8.37,
    DangerousDrugFee: 5.18,
    ExtemporaneouslyPrepared: 10.41,
    AllowableAdditionalPatientCharge: 3.29,
};
function getWholesaleMarkup(aemp) {
    if (aemp <= 5.5) {
        return 0.41;
    }
    else if (aemp > 5.5 && aemp <= 720) {
        return +new decimal_js_1.Decimal(aemp * 0.0752).toFixed(2);
    }
    else {
        return 54.14;
    }
}
exports.getWholesaleMarkup = getWholesaleMarkup;
function getAHIFee(priceToPharmacistsForMaxQuantity) {
    const tier1Fee = 4.62;
    if (priceToPharmacistsForMaxQuantity < 100) {
        return tier1Fee;
    }
    else if (priceToPharmacistsForMaxQuantity >= 100 &&
        priceToPharmacistsForMaxQuantity <= 2000) {
        return +new decimal_js_1.Decimal(tier1Fee + (priceToPharmacistsForMaxQuantity - 100) * 0.05).toFixed(2);
    }
    else {
        return tier1Fee + 95;
    }
}
exports.getAHIFee = getAHIFee;
exports.AdditionalFeesForSafetyNetPrices = {
    ReadyPrepared: 1.4,
    ExtemporaneouslyPrepared: 1.8,
};
exports.EfficientFundingOfChemotherapy = {
    PreparationFee: 88.62,
    DistributionFee: 29.15,
    DiluentFee: 5.77,
};
exports.PatientCoPaymentAmounts = {
    General: 30,
    Concessional: 7.3,
};
exports.SafetyNetThresholds = {
    General: 1563.5,
    Concessional: 262.8,
};
exports.SafetyNetCardIssueFee = 11.42;
