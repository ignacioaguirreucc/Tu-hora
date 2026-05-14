import type { AvatarTone } from '@/theme';

export type Role = 'client' | 'professional' | 'owner';

export type Professional = {
  id: string;
  name: string;
  spec: string;
  category: string;
  tone: AvatarTone;
  rating: number;
  reviews: number;
  distance: string;
  address: string;
  experience: string;
  available: 'Hoy' | 'Mañana';
  basePrice: number;
  verified: boolean;
  services: { name: string; duration: string; price: number; popular?: boolean }[];
};

export type Space = {
  id: string;
  name: string;
  address: string;
  distance: string;
  pricePerHour: number;
  rating: number;
  image: 'sand' | 'olive' | 'stone' | 'blush' | 'sky' | 'ink';
  open: boolean;
  equipment: string[];
};

export type Appointment = {
  id: string;
  client: string;
  service: string;
  time: string;
  duration: string;
  location: string;
  status: 'done' | 'next' | 'soon';
};
