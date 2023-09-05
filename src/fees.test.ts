import * as Fees from "./fees";

describe("Fees", () => {
  test("Wholesale Markup Calculations", () => {
    expect(Fees.getWholesaleMarkup(3)).toBe(0.41);
    expect(Fees.getWholesaleMarkup(5.5)).toBe(0.41);
    expect(Fees.getWholesaleMarkup(0)).toBe(0.41);
    expect(Fees.getWholesaleMarkup(10)).toBe(0.75);
    expect(Fees.getWholesaleMarkup(719)).toBe(54.07);
    expect(Fees.getWholesaleMarkup(720)).toBe(54.14);
    expect(Fees.getWholesaleMarkup(721)).toBe(54.14);
    expect(Fees.getWholesaleMarkup(1_000)).toBe(54.14);
  });

  test("AHI Fee Calculations", () => {
    expect(Fees.getAHIFee(1)).toBe(4.62);
    expect(Fees.getAHIFee(99)).toBe(4.62);
    expect(Fees.getAHIFee(100)).toBe(4.62);
    expect(Fees.getAHIFee(101)).toBe(4.67);
    expect(Fees.getAHIFee(150)).toBe(7.12);
    expect(Fees.getAHIFee(500)).toBe(24.62);
    expect(Fees.getAHIFee(1_999)).toBe(99.57);
    expect(Fees.getAHIFee(2_000)).toBe(99.62);
    expect(Fees.getAHIFee(2_001)).toBe(99.62);
  });
});
