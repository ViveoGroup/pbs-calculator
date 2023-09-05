// Prices as at 1 July 2023

import {
  ICalculatePBSPriceInput,
  ICalculateDispensedPriceInput,
  getPBSPrice,
  getDispensedPriceForQuantity,
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
      const input: ICalculateDispensedPriceInput = {
        approvedExManufacturerPrice: 1,
        maxQuantity: 30,
        packSize: 30,
        isDangerousDrug: true,
      };

      expect(getDispensedPriceForQuantity(input)).toBe(19.58);
    });

    test("Calculate Sertraline dispense price", () => {
      const input: ICalculateDispensedPriceInput = {
        approvedExManufacturerPrice: 2.5,
        maxQuantity: 30,
        packSize: 30,
        isDangerousDrug: false,
      };

      expect(getDispensedPriceForQuantity(input)).toBe(15.9);
    });

    test("Calculate Zoloft (Sertraline) dispense price", () => {
      const input: ICalculateDispensedPriceInput = {
        approvedExManufacturerPrice: 2.5,
        maxQuantity: 30,
        packSize: 30,
        isDangerousDrug: false,
        brandPremium: 5.58,
      };

      expect(getDispensedPriceForQuantity(input)).toBe(21.48);
    });

    test("Calculate Sertraline dispensed price for half pack", () => {
      const input: ICalculateDispensedPriceInput = {
        approvedExManufacturerPrice: 2.5,
        maxQuantity: 30,
        packSize: 15,
        isDangerousDrug: false,
      };

      expect(getDispensedPriceForQuantity(input)).toBe(16.5);
    });

    test("Calculate Jardiance dispensed price", () => {
      const input: ICalculateDispensedPriceInput = {
        approvedExManufacturerPrice: 44.66,
        maxQuantity: 30,
        packSize: 30,
        isDangerousDrug: false,
      };

      expect(getDispensedPriceForQuantity(input)).toBe(61.01);
    });

    test("Calculate Atorvastatin 80mg dispensed price", () => {
      const input: ICalculateDispensedPriceInput = {
        approvedExManufacturerPrice: 4,
        maxQuantity: 30,
        packSize: 30,
        isDangerousDrug: false,
      };

      expect(getDispensedPriceForQuantity(input)).toBe(17.29);
    });

    test("Calculate Atorvastatin 80mg dispensed price for half pack", () => {
      const input: ICalculateDispensedPriceInput = {
        approvedExManufacturerPrice: 4,
        maxQuantity: 60,
        packSize: 30,
        isDangerousDrug: false,
      };

      expect(getDispensedPriceForQuantity(input)).toBe(21.59);
    });
  });

  describe("Concessional pricing", () => {
    test("Calculate Sertraline concessional price with allowable discount", () => {
      const input: ICalculatePBSPriceInput = {
        approvedExManufacturerPrice: 2.5,
        maxQuantity: 30,
        packSize: 30,
        isDangerousDrug: false,
        includeAllowableDiscount: false,
      };

      expect(getPBSPrice(input)).toBe(7.3);
    });

    test("Calculate Sertraline concessional price with allowable discount", () => {
      const input: ICalculatePBSPriceInput = {
        approvedExManufacturerPrice: 2.5,
        maxQuantity: 30,
        packSize: 30,
        isDangerousDrug: false,
        includeAllowableDiscount: true,
      };

      expect(getPBSPrice(input)).toBe(6.3);
    });

    test("Calculate Atorvastatin 80mg concessional price with allowable discount", () => {
      const input: ICalculatePBSPriceInput = {
        approvedExManufacturerPrice: 4,
        maxQuantity: 30,
        packSize: 30,
        isDangerousDrug: false,
        includeAllowableDiscount: false,
      };

      expect(getPBSPrice(input)).toBe(7.3);
    });

    test("Calculate Atorvastatin 80mg concessional price for half pack with allowable discount", () => {
      const input: ICalculatePBSPriceInput = {
        approvedExManufacturerPrice: 4,
        maxQuantity: 60,
        packSize: 30,
        isDangerousDrug: false,
        includeAllowableDiscount: true,
      };

      expect(getPBSPrice(input)).toBe(6.3);
    });

    test("Expensive medication to be capped at $30", () => {
      const input: ICalculatePBSPriceInput = {
        approvedExManufacturerPrice: 400,
        maxQuantity: 60,
        packSize: 30,
        isDangerousDrug: false,
        includeAllowableDiscount: false,
      };

      expect(getPBSPrice(input)).toBe(30);
    });

    test("Expensive medication to be capped at $30 with $1 discount applied", () => {
      const input: ICalculatePBSPriceInput = {
        approvedExManufacturerPrice: 400,
        maxQuantity: 60,
        packSize: 30,
        isDangerousDrug: false,
        includeAllowableDiscount: true,
      };

      expect(getPBSPrice(input)).toBe(29);
    });
  });
});
