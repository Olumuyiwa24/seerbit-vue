

export interface DynamicSplitRule {
  accountId: string;
  percentage: number;
}

export interface CustomizationTheme {
  border_color?: string;
  background_color?: string;
  button_color?: string;
}

export interface Customization {
  theme?: CustomizationTheme;
  payment_method?: string[];
  display_fee?: boolean;
  display_type?: string;
  logo?: string;
}

export interface SeerbitCheckoutProps {
  version?: number;
  buttonText?: string;
  publicKey: string;
  description?: string;
  vendorId?: string;
  email: string;
  mobileNo?: string;
  fullName?: string;
  amount: string;
  tranref: string;
  country?: string;
  currency?: string;
  planId?: string;
  pocketRef?: string;
  setAmountByCustomer?: boolean;
  tokenize?: boolean;
  closePrompt?: boolean;
  customization?: Customization;
  callbackurl?: string;
  onCallback: (response: any) => void;
  onCloseCheckout: () => void;
  autoCheckout?: boolean;
  dynamicSplit?: DynamicSplitRule[];
}