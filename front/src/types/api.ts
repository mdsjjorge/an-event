export interface EventContent {
  id: string;
  navTitle: string;
  eventTitle: string;
  eventSubtitle: string;
  giftSectionTitle: string;
  giftSectionDescription: string;
  rsvpTitle: string;
  rsvpDescription: string;
  footerText: string;
  supportPhone: string;
}

export interface GiftItem {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

export interface RsvpPayload {
  name: string;
  guests: number;
}

export interface PixPaymentPayload {
  transactionAmount: number;
  description: string;
  payer: {
    email: string;
    firstName: string;
    lastName: string;
    identificationType: "CPF";
    identificationNumber: string;
  };
}

export interface PixPaymentResponse {
  id: string;
  status: string | null;
  statusDetail: string | null;
  qrCode: string;
  qrCodeBase64: string;
  ticketUrl: string;
}
