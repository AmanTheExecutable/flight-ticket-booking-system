export interface Flight {
  id: number;
  flightNumber: string;
  company: string;
  source: string;
  destination: string;
  departureDate: string;
  departureTime: string;
  arrivalTime: string;
  arrivalDate: string;
  path: string;
  duration?: string;
  economy_class_price?: number;
  first_class_price?: number;
  business_class_price?: number;
  economy_class_seats?: number;
  first_class_seats?: number;
  business_class_seats?: number;
}
