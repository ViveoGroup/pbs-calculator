/**
 * Prices as at 1 July 2023
 *
 * - Maxalt 10mg Wafer 4 (2 x 2) - Rizatriptan
 */

import {
  ICalculateDPMQInput,
  calculateDPMQ,
  getPBSPrice,
  getPackSizeQuantityFactor,
  getPriceToPharmacy,
} from "./calculator";

describe("Calculator", () => {
  test("Get max quantity factor", () => {
    expect(getPackSizeQuantityFactor(30, 30)).toBe(1);
    expect(getPackSizeQuantityFactor(15, 30)).toBe(2);
    expect(getPackSizeQuantityFactor(10, 30)).toBe(3);
    expect(() => getPackSizeQuantityFactor(60, 30)).toThrow(
      "PACK_SIZE_LARGER_THAN_MAX_QUANTITY"
    );
  });

  test("Calculate cost to pharmacy", () => {
    expect(getPriceToPharmacy(1)).toBe(1.41);
    expect(getPriceToPharmacy(5.5)).toBe(5.91);
    expect(getPriceToPharmacy(10)).toBe(10.75);
  });

  describe("Dispense prices", () => {
    test("Calculate dangerous drug fee", () => {
      expect(
        calculateDPMQ({
          aemp: 1,
          maxQuantity: 30,
          packSize: 30,
          isDangerousDrug: true,
        })
      ).toBe(19.58);
    });

    test("Calculate Sertraline dispense price", () => {
      expect(
        calculateDPMQ({
          aemp: 2.5,
          maxQuantity: 30,
          packSize: 30,
        })
      ).toBe(15.9);
    });

    test("Calculate Zoloft (Sertraline) dispense price", () => {
      expect(
        calculateDPMQ({
          aemp: 2.5,
          maxQuantity: 30,
          packSize: 30,
          brandPremium: 5.58,
        })
      ).toBe(21.48);
    });

    test("Calculate Sertraline dispensed price for half pack", () => {
      expect(
        calculateDPMQ({
          aemp: 2.5,
          maxQuantity: 30,
          packSize: 15,
        })
      ).toBe(16.5);
    });

    test("Calculate Jardiance dispensed price", () => {
      expect(
        calculateDPMQ({
          aemp: 44.66,
          maxQuantity: 30,
          packSize: 30,
        })
      ).toBe(61.01);
    });

    test("Calculate Flucloxacillin capsule 500mg", () => {
      expect(
        calculateDPMQ({
          aemp: 8.08,
          maxQuantity: 48,
          packSize: 24,
        })
      ).toBe(29.46);
    });

    test("Calculate Capsule containing lisdexamfetamine dimesilate 20 mg (Vyvanse)", () => {
      expect(
        calculateDPMQ({
          aemp: 76.1,
          maxQuantity: 30,
          packSize: 30,
        })
      ).toBe(99.99);
    });

    test("Calculate Atorvastatin 80mg dispensed price", () => {
      expect(
        calculateDPMQ({
          aemp: 4,
          maxQuantity: 30,
          packSize: 30,
        })
      ).toBe(17.29);
    });

    test("Calculate Atorvastatin 80mg dispensed price for half pack", () => {
      expect(
        calculateDPMQ({
          aemp: 4,
          maxQuantity: 60,
          packSize: 30,
        })
      ).toBe(21.59);
    });

    test("Calculate Fluticasone furoate for a single dose", () => {
      expect(
        calculateDPMQ({
          aemp: 74.01,
          maxQuantity: 1,
          packSize: 1,
        })
      ).toBe(91.66);
    });
  });

  describe("Concessional pricing", () => {
    test("Concessional less than 30", () => {
      expect(getPBSPrice({ dpmq: 15, isConcessional: true })).toBe(7.3);
    });

    test("Concessional less than 30 with allowable discount", () => {
      expect(
        getPBSPrice({
          dpmq: 15.9,
          isConcessional: true,
          includeAllowableDiscount: true,
        })
      ).toBe(6.3);
    });

    test("Concessional equals 30", () => {
      expect(getPBSPrice({ dpmq: 30, isConcessional: true })).toBe(7.3);
    });

    test("Concessional equals 30 with allowable discount", () => {
      expect(
        getPBSPrice({
          dpmq: 30,
          isConcessional: true,
          includeAllowableDiscount: true,
        })
      ).toBe(6.3);
    });

    test("Concessional over 30", () => {
      expect(getPBSPrice({ dpmq: 50, isConcessional: true })).toBe(7.3);
    });

    test("Concessional over 30 with allowable discount", () => {
      expect(
        getPBSPrice({
          dpmq: 50,
          includeAllowableDiscount: true,
          isConcessional: true,
        })
      ).toBe(6.3);
    });

    test("Non-concessional less than 30", () => {
      expect(getPBSPrice({ dpmq: 15 })).toBe(7.3);
    });

    test("Non-concessional less than 30 with allowable discount", () => {
      expect(
        getPBSPrice({
          dpmq: 15.9,

          includeAllowableDiscount: true,
        })
      ).toBe(6.3);
    });

    test("Non-concessional equals 30", () => {
      expect(getPBSPrice({ dpmq: 30 })).toBe(7.3);
    });

    test("Non-concessional equals 30 with allowable discount", () => {
      expect(
        getPBSPrice({
          dpmq: 30,

          includeAllowableDiscount: true,
        })
      ).toBe(6.3);
    });

    test("Non-concessional over 30", () => {
      expect(getPBSPrice({ dpmq: 50 })).toBe(30);
    });

    test("Non-concessional over 30 with allowable discount", () => {
      expect(
        getPBSPrice({
          dpmq: 50,
          includeAllowableDiscount: true,
        })
      ).toBe(29);
    });

    test("Concessional safety net less than 30", () => {
      expect(
        getPBSPrice({ dpmq: 15, isConcessional: true, isSafetyNet: true })
      ).toBe(0);
    });

    test("Concessional safety net less than 30 with allowable discount", () => {
      expect(
        getPBSPrice({
          dpmq: 15.9,
          isConcessional: true,
          includeAllowableDiscount: true,
          isSafetyNet: true,
        })
      ).toBe(0);
    });

    test("Concessional safety net equals 30", () => {
      expect(
        getPBSPrice({ dpmq: 30, isConcessional: true, isSafetyNet: true })
      ).toBe(0);
    });

    test("Concessional safety net equals 30 with allowable discount", () => {
      expect(
        getPBSPrice({
          dpmq: 30,
          isConcessional: true,
          isSafetyNet: true,
          includeAllowableDiscount: true,
        })
      ).toBe(0);
    });

    test("Concessional safety net over 30", () => {
      expect(
        getPBSPrice({ dpmq: 50, isConcessional: true, isSafetyNet: true })
      ).toBe(0);
    });

    test("Concessional safety net over 30 with brand premium", () => {
      expect(
        getPBSPrice({
          dpmq: 50,
          isConcessional: true,
          isSafetyNet: true,
          brandPremium: 10,
        })
      ).toBe(10);
    });

    test("Concessional safety net over 30 with brand premium and allowable discount", () => {
      expect(
        getPBSPrice({
          dpmq: 50,
          isConcessional: true,
          isSafetyNet: true,
          includeAllowableDiscount: true,
          brandPremium: 10,
        })
      ).toBe(9);
    });

    test("Concessional safety net over 30 with allowable discount", () => {
      expect(
        getPBSPrice({
          dpmq: 50,
          includeAllowableDiscount: true,
          isConcessional: true,
          isSafetyNet: true,
        })
      ).toBe(0);
    });

    test("Non-concessional safety net less than 30", () => {
      expect(getPBSPrice({ dpmq: 15, isSafetyNet: true })).toBe(7.3);
    });

    test("Non-concessional safety net less than 30 with allowable discount", () => {
      expect(
        getPBSPrice({
          dpmq: 15.9,
          isSafetyNet: true,
          includeAllowableDiscount: true,
        })
      ).toBe(6.3);
    });

    test("Non-concessional safety net equals 30", () => {
      expect(getPBSPrice({ dpmq: 30, isSafetyNet: true })).toBe(7.3);
    });

    test("Non-concessional safety net equals 30 and brand premium", () => {
      expect(
        getPBSPrice({ dpmq: 30, isSafetyNet: true, brandPremium: 10 })
      ).toBe(17.3);
    });

    test("Non-concessional safety net equals 30 with allowable discount", () => {
      expect(
        getPBSPrice({
          dpmq: 30,
          isSafetyNet: true,
          includeAllowableDiscount: true,
        })
      ).toBe(6.3);
    });

    test("Non-concessional safety net over 30", () => {
      expect(getPBSPrice({ dpmq: 50, isSafetyNet: true })).toBe(7.3);
    });

    test("Non-concessional safety net over 30 with allowable discount", () => {
      expect(
        getPBSPrice({
          dpmq: 50,
          isSafetyNet: true,
          includeAllowableDiscount: true,
        })
      ).toBe(6.3);
    });
  });
});
