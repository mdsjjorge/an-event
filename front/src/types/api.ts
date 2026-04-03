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
  pixKey: string;
  pixCity: string;
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
