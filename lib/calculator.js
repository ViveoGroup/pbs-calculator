"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSafetyNetPrice = exports.getPBSPrice = exports.calculatePBSPriceFromAEMP = exports.calculateDPMQ = exports.getPackSizeQuantityFactor = exports.getPriceToPharmacy = void 0;
const decimal_js_1 = __importDefault(require("decimal.js"));
const fees_1 = require("./fees");
function getPriceToPharmacy(aemp) {
    return aemp + (0, fees_1.getWholesaleMarkup)(aemp);
}
exports.getPriceToPharmacy = getPriceToPharmacy;
function getPackSizeQuantityFactor(packSize, maxQuantity) {
    if (packSize > maxQuantity) {
        throw new Error("PACK_SIZE_LARGER_THAN_MAX_QUANTITY");
    }
    return maxQuantity / packSize;
}
exports.getPackSizeQuantityFactor = getPackSizeQuantityFactor;
function calculateDPMQ({ aemp, maxQuantity, packSize, isDangerousDrug, isExtemporaneouslyPrepared, brandPremium, }) {
    let cost = 0;
    if (isExtemporaneouslyPrepared) {
        cost += fees_1.DispensingFees.ExtemporaneouslyPrepared;
    }
    else {
        cost += fees_1.DispensingFees.ReadyPrepared;
    }
    const qtyFactor = getPackSizeQuantityFactor(packSize, maxQuantity);
    let priceToPharmacy = +new decimal_js_1.default(getPriceToPharmacy(aemp) * qtyFactor).toFixed(2);
    if (brandPremium) {
        priceToPharmacy += brandPremium;
    }
    cost += priceToPharmacy;
    cost += (0, fees_1.getAHIFee)(priceToPharmacy) / qtyFactor;
    if (isDangerousDrug) {
        cost += fees_1.DispensingFees.DangerousDrugFee;
    }
    return +new decimal_js_1.default(cost).toFixed(2);
}
exports.calculateDPMQ = calculateDPMQ;
function calculatePBSPriceFromAEMP({ aemp, includeAllowableDiscount, packSize, maxQuantity, isDangerousDrug, brandPremium, isExtemporaneouslyPrepared, isConcessional, }) {
    const dpmq = calculateDPMQ({
        aemp,
        maxQuantity,
        packSize,
        isDangerousDrug,
        brandPremium,
        isExtemporaneouslyPrepared,
    });
    return getPBSPrice({
        dpmq,
        isConcessional,
        includeAllowableDiscount,
    });
}
exports.calculatePBSPriceFromAEMP = calculatePBSPriceFromAEMP;
function getPBSPrice({ dpmq, isConcessional, includeAllowableDiscount, }) {
    let output = fees_1.PatientCoPaymentAmounts.General;
    if (dpmq <= fees_1.PatientCoPaymentAmounts.General || isConcessional) {
        output = fees_1.PatientCoPaymentAmounts.Concessional;
    }
    if (includeAllowableDiscount) {
        output = output - 1;
    }
    return output;
}
exports.getPBSPrice = getPBSPrice;
function getSafetyNetPrice({ aemp: approvedExManufacturerPrice, includeAllowableDiscount, packSize, maxQuantity, isDangerousDrug, brandPremium, isConcessional, isExtemporaneouslyPrepared, }) {
    let cost = 0;
    cost += fees_1.AdditionalFeesForSafetyNetPrices.ReadyPrepared;
    if (isExtemporaneouslyPrepared) {
        cost += fees_1.AdditionalFeesForSafetyNetPrices.ExtemporaneouslyPrepared;
    }
}
exports.getSafetyNetPrice = getSafetyNetPrice;
