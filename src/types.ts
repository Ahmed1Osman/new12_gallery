export interface Painting {
  id: string;
  title: string;
  price: number;
  image: string;
  dimensions: string;
  type: string;
}

export interface ContactForm {
  name: string;
  email: string;
  message: string;
}

export interface PurchaseForm {
  name: string;
  email: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  paintingId: string;
}