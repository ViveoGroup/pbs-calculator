/**
 * Fees as at 1 July 2023.
 * For more information, visit https://www.pbs.gov.au/info/healthpro/explanatory-notes/front/fee
 */

import { Decimal } from "decimal.js";

export const DispensingFees = {
  ReadyPrepared: 8.37,
  DangerousDrugFee: 5.18,
  ExtemporaneouslyPrepared: 10.41,
  AllowableAdditionalPatientCharge: 3.29,
};

export function getWholesaleMarkup(aemp: number): number {
  if (aemp <= 5.5) {
    return 0.41;
  } else if (aemp > 5.5 && aemp <= 720) {
    return +new Decimal(aemp * 0.0752).toFixed(2);
  } else {
    return 54.14;
  }
}

export function getAHIFee(priceToPharmacistsForMaxQuantity: number): number {
  const tier1Fee = 4.62;

  if (priceToPharmacistsForMaxQuantity < 100) {
    return tier1Fee;
  } else if (
    priceToPharmacistsForMaxQuantity >= 100 &&
    priceToPharmacistsForMaxQuantity <= 2_000
  ) {
    return +new Decimal(
      tier1Fee + (priceToPharmacistsForMaxQuantity - 100) * 0.05
    ).toFixed(2);
  } else {
    return tier1Fee + 95;
  }
}

export const AdditionalFeesForSafetyNetPrices = {
  ReadyPrepared: 1.4,
  ExtemporaneouslyPrepared: 1.8,
};

export const EfficientFundingOfChemotherapy = {
  PreparationFee: 88.62,
  DistributionFee: 29.15,
  DiluentFee: 5.77,
};

export const PatientCoPaymentAmounts = {
  General: 30,
  Concessional: 7.3,
};

export const SafetyNetThresholds = {
  General: 1563.5,
  Concessional: 262.8,
};

export const SafetyNetCardIssueFee = 11.42;
