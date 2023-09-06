/**
 * Prices as at 1 July 2023
 *
 * - Maxalt 10mg Wafer 4 (2 x 2) - Rizatriptan
 */

import {
  ICalculateDPMQInput,
  ICalculatePBSPriceFromAEMPInput,
  calculateDPMQ,
  calculatePBSPriceFromAEMP,
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
      const input: ICalculateDPMQInput = {
        aemp: 1,
        maxQuantity: 30,
        packSize: 30,
        isDangerousDrug: true,
      };

      expect(calculateDPMQ(input)).toBe(19.58);
    });

    test("Calculate Sertraline dispense price", () => {
      const input: ICalculateDPMQInput = {
        aemp: 2.5,
        maxQuantity: 30,
        packSize: 30,
      };

      expect(calculateDPMQ(input)).toBe(15.9);
    });

    test("Calculate Zoloft (Sertraline) dispense price", () => {
      const input: ICalculateDPMQInput = {
        aemp: 2.5,
        maxQuantity: 30,
        packSize: 30,
        brandPremium: 5.58,
      };

      expect(calculateDPMQ(input)).toBe(21.48);
    });

    test("Calculate Sertraline dispensed price for half pack", () => {
      const input: ICalculateDPMQInput = {
        aemp: 2.5,
        maxQuantity: 30,
        packSize: 15,
      };

      expect(calculateDPMQ(input)).toBe(16.5);
    });

    test("Calculate Jardiance dispensed price", () => {
      const input: ICalculateDPMQInput = {
        aemp: 44.66,
        maxQuantity: 30,
        packSize: 30,
      };

      expect(calculateDPMQ(input)).toBe(61.01);
    });

    test("Calculate Flucloxacillin capsule 500mg", () => {
      const input: ICalculateDPMQInput = {
        aemp: 8.08,
        maxQuantity: 48,
        packSize: 24,
      };

      expect(calculateDPMQ(input)).toBe(29.46);
    });

    test("Calculate Capsule containing lisdexamfetamine dimesilate 20 mg (Vyvanse)", () => {
      const input: ICalculateDPMQInput = {
        aemp: 76.1,
        maxQuantity: 30,
        packSize: 30,
      };

      expect(calculateDPMQ(input)).toBe(99.99);
    });

    test("Calculate Atorvastatin 80mg dispensed price", () => {
      const input: ICalculateDPMQInput = {
        aemp: 4,
        maxQuantity: 30,
        packSize: 30,
      };

      expect(calculateDPMQ(input)).toBe(17.29);
    });

    test("Calculate Atorvastatin 80mg dispensed price for half pack", () => {
      const input: ICalculateDPMQInput = {
        aemp: 4,
        maxQuantity: 60,
        packSize: 30,
      };

      expect(calculateDPMQ(input)).toBe(21.59);
    });

    test("Calculate Fluticasone furoate for a single dose", () => {
      const input: ICalculateDPMQInput = {
        aemp: 74.01,
        maxQuantity: 1,
        packSize: 1,
      };

      expect(calculateDPMQ(input)).toBe(91.66);
    });
  });

  describe("Concessional pricing", () => {
    test("Calculate Sertraline concessional price with allowable discount", () => {
      const input: ICalculatePBSPriceFromAEMPInput = {
        aemp: 2.5,
        maxQuantity: 30,
        packSize: 30,
        includeAllowableDiscount: false,
      };

      expect(calculatePBSPriceFromAEMP(input)).toBe(7.3);
    });

    test("Calculate Sertraline concessional price with allowable discount", () => {
      const input: ICalculatePBSPriceFromAEMPInput = {
        aemp: 2.5,
        maxQuantity: 30,
        packSize: 30,
        includeAllowableDiscount: true,
      };

      expect(calculatePBSPriceFromAEMP(input)).toBe(6.3);
    });

    test("Calculate Atorvastatin 80mg concessional price with allowable discount", () => {
      const input: ICalculatePBSPriceFromAEMPInput = {
        aemp: 4,
        maxQuantity: 30,
        packSize: 30,
        includeAllowableDiscount: false,
      };

      expect(calculatePBSPriceFromAEMP(input)).toBe(7.3);
    });

    test("Calculate Atorvastatin 80mg concessional price for half pack with allowable discount", () => {
      const input: ICalculatePBSPriceFromAEMPInput = {
        aemp: 4,
        maxQuantity: 60,
        packSize: 30,
        includeAllowableDiscount: true,
      };

      expect(calculatePBSPriceFromAEMP(input)).toBe(6.3);
    });

    test("Expensive medication to be capped at $30", () => {
      const input: ICalculatePBSPriceFromAEMPInput = {
        aemp: 400,
        maxQuantity: 60,
        packSize: 30,
        includeAllowableDiscount: false,
      };

      expect(calculatePBSPriceFromAEMP(input)).toBe(30);
    });

    test("Expensive medication to be capped at $30 with $1 discount applied", () => {
      const input: ICalculatePBSPriceFromAEMPInput = {
        aemp: 400,
        maxQuantity: 60,
        packSize: 30,
        includeAllowableDiscount: true,
      };

      expect(calculatePBSPriceFromAEMP(input)).toBe(29);
    });
  });
});
