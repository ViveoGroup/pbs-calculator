import * as Fees from "./fees";
import * as Calculator from "./calculator";

export { Fees, Calculator };

declare global {
  interface Window {
    pbs: any;
  }
}

if (typeof window !== undefined) {
  window.pbs = { Fees, Calculator };
}
