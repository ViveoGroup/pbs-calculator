"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SafetyNetPrice = exports.getPBSPrice = exports.getDiscountedPBSPrice = exports.getDispensedPriceForQuantity = exports.getPackSizeQuantityFactor = exports.getPriceToPharmacy = void 0;
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
function getDispensedPriceForQuantity({ approvedExManufacturerPrice, maxQuantity, packSize, isDangerousDrug, brandPremium, }) {
    let cost = 0;
    const dispenseFee = fees_1.DispensingFees.ReadyPrepared;
    cost += dispenseFee;
    const qtyFactor = getPackSizeQuantityFactor(packSize, maxQuantity);
    const priceToPharmacy = +new decimal_js_1.default(getPriceToPharmacy(approvedExManufacturerPrice) * qtyFactor).toFixed(2);
    cost += priceToPharmacy;
    const ahi = (0, fees_1.getAHIFee)(priceToPharmacy) / qtyFactor;
    cost += ahi;
    if (brandPremium) {
        cost += brandPremium;
    }
    if (isDangerousDrug) {
        cost += fees_1.DispensingFees.DangerousDrugFee;
    }
    return +new decimal_js_1.default(cost).toFixed(2);
}
exports.getDispensedPriceForQuantity = getDispensedPriceForQuantity;
function getDiscountedPBSPrice() { }
exports.getDiscountedPBSPrice = getDiscountedPBSPrice;
function getPBSPrice({ approvedExManufacturerPrice, includeAllowableDiscount, packSize, maxQuantity, isDangerousDrug, brandPremium, }) {
    const privatePrice = getDispensedPriceForQuantity({
        approvedExManufacturerPrice,
        maxQuantity,
        packSize,
        isDangerousDrug,
        brandPremium,
    });
    let output = fees_1.PatientCoPaymentAmounts.General;
    if (privatePrice <= fees_1.PatientCoPaymentAmounts.General) {
        output = fees_1.PatientCoPaymentAmounts.Concessional;
    }
    if (includeAllowableDiscount) {
        output = output - 1;
    }
    return output;
}
exports.getPBSPrice = getPBSPrice;
exports.SafetyNetPrice = 0;
