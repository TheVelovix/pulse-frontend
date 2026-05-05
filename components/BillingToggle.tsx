"use client";
import { useState } from "react";
import PricingButton from "./PricingButton";

const MONTHLY_PRICE = 7;
const ANNUAL_PRICE = 70;
const ANNUAL_MONTHLY_EQUIVALENT = (ANNUAL_PRICE / 12).toFixed(2);

export default function BillingToggle() {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <>
      {/* Toggle */}
      <div className="flex items-center justify-center gap-3 mb-10 ">
        <span
          className={`text-sm font-medium transition-colors ${!isAnnual ? "text-white" : "text-text-muted"}`}
        >
          Monthly
        </span>
        <button
          onClick={() => setIsAnnual(prev => !prev)}
          className={`relative w-12 h-6 rounded-full cursor-pointer transition-colors duration-300 focus:outline-none ${
            isAnnual ? "bg-accent" : "bg-white/15"
          }`}
          aria-label="Toggle billing period"
        >
          <span
            className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-300 ${
              isAnnual ? "translate-x-6" : "translate-x-0"
            }`}
          />
        </button>
        <div className="flex items-center gap-2">
          <span
            className={`text-sm font-medium transition-colors ${isAnnual ? "text-white" : "text-text-muted"}`}
          >
            Annually
          </span>
          <span className="text-xs text-center font-semibold rounded-full bg-accent/15 text-accent px-2 py-0.5">
            2 months free
          </span>
        </div>
      </div>

      {/* Pro price + CTA -- only the dynamic parts */}
      <div className="flex items-end gap-1 mb-1">
        <span className="text-4xl font-bold">
          €{isAnnual ? ANNUAL_MONTHLY_EQUIVALENT : MONTHLY_PRICE}
        </span>
        <span className="text-text-muted text-sm mb-1">/month</span>
      </div>
      <p className="text-sm text-text-muted mb-8">
        {isAnnual ? `€${ANNUAL_PRICE} billed annually` : "Billed monthly"}
      </p>
      <PricingButton
        plan="pro"
        label="Get started with Pro"
        variant="primary"
        isAnnual={isAnnual}
      />
    </>
  );
}
