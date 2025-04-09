export interface User {
  id: string;
  username: string;
  email: string;
  profilePic?: string | null;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface cartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
  image?: string;
  variant?: string;
}

export interface CartState {
  items: cartItem[];
  totalQuantity: number;
  totalPrice: number;
  discountPrice?: number;
  shippingPrice?: number;
}

export interface Brand {
  _id: number;
  name: string;
  logo: string;
}
export interface Category {
  _id: number;
  name: string;
  image: string;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  discountedPrice: number;
  discountPercent: number;
  image: string[];
  priceByVariant: {
    _id: string;
    variant: string;
    price: number;
  }[];
  category: {
    _id: string;
    name: string;
    image: string;
  };
  stock: number;
  rating: number;
}

export interface Slider {
  _id: string;
  title: string;
  description: string;
  image: string;
  buttonText: string;
  buttonLink: string;
}
