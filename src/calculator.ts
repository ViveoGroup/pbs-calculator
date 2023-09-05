import Decimal from "decimal.js";
import {
  DispensingFees,
  PatientCoPaymentAmounts,
  getAHIFee,
  getWholesaleMarkup,
} from "./fees";

export interface ICalculateDispensedPriceInput {
  approvedExManufacturerPrice: number;
  maxQuantity: number;
  packSize: number;
  isDangerousDrug: boolean;
  brandPremium?: number;
}

export function getPriceToPharmacy(aemp: number): number {
  return aemp + getWholesaleMarkup(aemp);
}

export function getPackSizeQuantityFactor(
  packSize: number,
  maxQuantity: number
) {
  if (packSize > maxQuantity) {
    throw new Error("PACK_SIZE_LARGER_THAN_MAX_QUANTITY");
  }

  return maxQuantity / packSize;
}

export function getDispensedPriceForQuantity({
  approvedExManufacturerPrice,
  maxQuantity,
  packSize,
  isDangerousDrug,
  brandPremium,
}: ICalculateDispensedPriceInput) {
  let cost = 0;

  const dispenseFee = DispensingFees.ReadyPrepared;
  cost += dispenseFee;

  const qtyFactor = getPackSizeQuantityFactor(packSize, maxQuantity);
  const priceToPharmacy = +new Decimal(
    getPriceToPharmacy(approvedExManufacturerPrice) * qtyFactor
  ).toFixed(2);
  cost += priceToPharmacy;

  const ahi = getAHIFee(priceToPharmacy) / qtyFactor;
  cost += ahi;

  if (brandPremium) {
    cost += brandPremium;
  }

  if (isDangerousDrug) {
    cost += DispensingFees.DangerousDrugFee;
  }

  return +new Decimal(cost).toFixed(2);
}

export function getDiscountedPBSPrice() {}

export interface ICalculatePBSPriceInput extends ICalculateDispensedPriceInput {
  includeAllowableDiscount: boolean;
}

export function getPBSPrice({
  approvedExManufacturerPrice,
  includeAllowableDiscount,
  packSize,
  maxQuantity,
  isDangerousDrug,
  brandPremium,
}: ICalculatePBSPriceInput) {
  const privatePrice = getDispensedPriceForQuantity({
    approvedExManufacturerPrice,
    maxQuantity,
    packSize,
    isDangerousDrug,
    brandPremium,
  });

  let output = PatientCoPaymentAmounts.General;

  if (privatePrice <= PatientCoPaymentAmounts.General) {
    output = PatientCoPaymentAmounts.Concessional;
  }

  if (includeAllowableDiscount) {
    output = output - 1;
  }

  return output;
}

export const SafetyNetPrice = 0;
