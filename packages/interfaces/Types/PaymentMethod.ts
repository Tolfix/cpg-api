export type TPayments = "none" | "manual" | "bank" | "paypal" | "credit_card" | "swish";
export const A_CC_Payments = [
    "credit_card",
    "paypal",
    "swish",
    "none",
    "manual",
    "bank"
] as const;

export type TRecurringMethod = "monthly" | "yearly" | "quarterly" | "semi_annually" | "biennially" | "triennially";
export const A_RecurringMethod = [
    "monthly",
    "yearly",
    "quarterly",
    "semi_annually",
    "biennially",
    "triennially"
] as const;