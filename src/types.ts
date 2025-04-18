export interface Painting {
  id: string;
  title: string;
  price: number;
  type: string;
  dimensions: string;
  image: string;
  description?: string;
  createdAt: string;
  date: string;
  [key: string]: any;
}



export interface ContactForm {

  name: string;

  email: string;

  message: string;

  subject: string;

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