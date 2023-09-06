import Decimal from "decimal.js";
import {
  AdditionalFeesForSafetyNetPrices,
  DispensingFees,
  PatientCoPaymentAmounts,
  getAHIFee,
  getWholesaleMarkup,
} from "./fees";

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

export interface ICalculateDPMQInput {
  aemp: number;
  maxQuantity: number;
  packSize: number;
  isDangerousDrug?: boolean;
  brandPremium?: number;
  isExtemporaneouslyPrepared?: boolean;
}

export function calculateDPMQ({
  aemp,
  maxQuantity,
  packSize,
  isDangerousDrug,
  isExtemporaneouslyPrepared,
  brandPremium,
}: ICalculateDPMQInput) {
  let cost = 0;

  if (isExtemporaneouslyPrepared) {
    cost += DispensingFees.ExtemporaneouslyPrepared;
  } else {
    cost += DispensingFees.ReadyPrepared;
  }

  const qtyFactor = getPackSizeQuantityFactor(packSize, maxQuantity);
  let priceToPharmacy = +new Decimal(
    getPriceToPharmacy(aemp) * qtyFactor
  ).toFixed(2);

  if (brandPremium) {
    priceToPharmacy += brandPremium;
  }

  cost += priceToPharmacy;
  cost += getAHIFee(priceToPharmacy) / qtyFactor;

  if (isDangerousDrug) {
    cost += DispensingFees.DangerousDrugFee;
  }

  return +new Decimal(cost).toFixed(2);
}

export interface ICalculatePBSPriceFromAEMPInput extends ICalculateDPMQInput {
  includeAllowableDiscount: boolean;
  isConcessional?: boolean;
}

export function calculatePBSPriceFromAEMP({
  aemp,
  includeAllowableDiscount,
  packSize,
  maxQuantity,
  isDangerousDrug,
  brandPremium,
  isExtemporaneouslyPrepared,
  isConcessional,
}: ICalculatePBSPriceFromAEMPInput) {
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

export interface ICalculatePBSPriceInput {
  dpmq: number;
  isConcessional?: boolean;
  includeAllowableDiscount?: boolean;
  isExtemporaneouslyPrepared?: boolean;
}

export function getPBSPrice({
  dpmq,
  isConcessional,
  includeAllowableDiscount,
}: ICalculatePBSPriceInput): number {
  let output = PatientCoPaymentAmounts.General;

  if (dpmq <= PatientCoPaymentAmounts.General || isConcessional) {
    output = PatientCoPaymentAmounts.Concessional;
  }

  if (includeAllowableDiscount) {
    output = output - 1;
  }

  return output;
}

export interface ICalculateSafetyNetPriceInput
  extends ICalculatePBSPriceFromAEMPInput {}

export function getSafetyNetPrice({
  aemp: approvedExManufacturerPrice,
  includeAllowableDiscount,
  packSize,
  maxQuantity,
  isDangerousDrug,
  brandPremium,
  isConcessional,
  isExtemporaneouslyPrepared,
}: ICalculateSafetyNetPriceInput) {
  let cost = 0;

  cost += AdditionalFeesForSafetyNetPrices.ReadyPrepared;

  if (isExtemporaneouslyPrepared) {
    cost += AdditionalFeesForSafetyNetPrices.ExtemporaneouslyPrepared;
  }
}
