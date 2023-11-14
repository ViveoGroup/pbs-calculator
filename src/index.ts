import * as Fees from "./fees";
import * as Calculator from "./calculator";

export { Fees, Calculator };

const pbs = { Fees, Calculator };

declare global {
  interface Window {
    pbs: any;
  }
}

if (typeof process === "object") {
  module.exports = pbs;
} else {
  window.pbs = pbs;
}
