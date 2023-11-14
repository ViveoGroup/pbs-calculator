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

  const answer = maxQuantity / packSize;
  return answer;
}

export interface ICalculateDPMQInput {
  aemp: number;
  maxQuantity: number;
  packSize: number;
  isDangerousDrug?: boolean;
  brandPremium?: number;
  includeAllowableDiscount?: boolean;
  isExtemporaneouslyPrepared?: boolean;
}

export function calculateDPMQ({
  aemp,
  maxQuantity,
  packSize,
  isDangerousDrug,
  isExtemporaneouslyPrepared,
  brandPremium,
  includeAllowableDiscount,
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

  cost += priceToPharmacy;
  cost += getAHIFee(priceToPharmacy) / qtyFactor;

  if (brandPremium) {
    cost += brandPremium;
  }

  if (isDangerousDrug) {
    cost += DispensingFees.DangerousDrugFee;
  }

  if (includeAllowableDiscount && cost >= 1) {
    cost = cost - 1;
  }

  return +new Decimal(cost).toFixed(2);
}

export interface ICalculatePBSPriceInput {
  dpmq: number;
  isConcessional?: boolean;
  includeAllowableDiscount?: boolean;
  isExtemporaneouslyPrepared?: boolean;
  isSafetyNet?: boolean;
  brandPremium?: number;
}

export function getPBSPrice({
  dpmq,
  isConcessional,
  isSafetyNet,
  includeAllowableDiscount,
  brandPremium,
}: ICalculatePBSPriceInput): number {
  let output = 0;

  if (!(isConcessional && isSafetyNet)) {
    output = PatientCoPaymentAmounts.General;

    if (
      dpmq <= PatientCoPaymentAmounts.General ||
      isConcessional ||
      (!isConcessional && isSafetyNet)
    ) {
      output = PatientCoPaymentAmounts.Concessional;
    }
  }

  if (brandPremium) {
    output = output + brandPremium;
  }

  if (includeAllowableDiscount && output >= 1) {
    output = output - 1;
  }

  return output;
}
