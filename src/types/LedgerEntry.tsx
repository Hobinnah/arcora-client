import type { LedgerTransaction } from "./LedgerTransaction";
import type { LedgerAccount } from "./LedgerAccount";

{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

export type LedgerEntry = {
    ledgerEntryID: string;
    ledgerTransactionID: string;
    ledgerAccountID: string;
    debitAmount: number;
    creditAmount: number;
    currency: string;
    description: string;
    capturedDate: string;
    capturedBy: string;
    ledgerTransaction: LedgerTransaction;
    ledgerAccount: LedgerAccount;
};
