export type DealStatus =
  | "CREATED"
  | "FUNDED"
  | "COMPLETED"
  | "RELEASED"
  | "REFUNDED"
  | "DISPUTED";

export type Deal = {
  id: string;
  dealIdOnChain: number;
  clientWallet: string;
  sellerWallet: string;
  token: string;
  amount: string; // stored as string
  status: DealStatus;

  txCreate: string | null;
  txFund: string | null;
  txComplete: string | null;
  txRelease: string | null;
  txRefund: string | null;

  createdAt: string;
  updatedAt: string;
};
