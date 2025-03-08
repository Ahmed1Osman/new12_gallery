export interface Painting {

  id: string;

  title: string;

  price: number;

  dimensions: string;

  type: string;

  image: string;

  date: string;

  description?: string; // Add the description property

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

// Add auth-related types
export interface LoginCredentials {
  username: string;
  password: string;
}