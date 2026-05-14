import {
  Home,
  Calendar,
  Clock,
  User,
  Search,
  Star,
  Heart,
  Bell,
  Check,
  ChevronRight,
  ChevronLeft,
  Plus,
  SlidersHorizontal,
  Map,
  MapPin,
  Settings,
  Sparkles,
  Wallet,
  Shield,
  FileText,
  Camera,
  TrendingUp,
  Gift,
  Share2,
  LogOut,
  MoreHorizontal,
  ArrowRight,
  CreditCard,
  Scissors,
  type LucideProps,
} from 'lucide-react-native';
import { T } from '@/theme';
import React from 'react';

export type IconProps = {
  size?: number;
  color?: string;
  strokeWidth?: number;
};

const mk = (Component: React.ComponentType<LucideProps>) =>
  ({ size = 20, color = T.ink, strokeWidth = 1.6 }: IconProps) =>
    <Component size={size} color={color} strokeWidth={strokeWidth} />;

export const IcHome = mk(Home);
export const IcCal = mk(Calendar);
export const IcClock = mk(Clock);
export const IcUser = mk(User);
export const IcSearch = mk(Search);
export const IcHeart = mk(Heart);
export const IcBell = mk(Bell);
export const IcCheck = mk(Check);
export const IcChevR = mk(ChevronRight);
export const IcChevL = mk(ChevronLeft);
export const IcPlus = mk(Plus);
export const IcFilter = mk(SlidersHorizontal);
export const IcMap = mk(Map);
export const IcPin = mk(MapPin);
export const IcSettings = mk(Settings);
export const IcSparkle = mk(Sparkles);
export const IcWallet = mk(Wallet);
export const IcShield = mk(Shield);
export const IcDoc = mk(FileText);
export const IcCam = mk(Camera);
export const IcTrend = mk(TrendingUp);
export const IcGift = mk(Gift);
export const IcShare = mk(Share2);
export const IcLogout = mk(LogOut);
export const IcMore = mk(MoreHorizontal);
export const IcArrowR = mk(ArrowRight);
export const IcCard = mk(CreditCard);
export const IcScissors = mk(Scissors);

export const IcStarFill = ({ size = 20, color = T.accent }: IconProps) => (
  <Star size={size} color={color} fill={color} strokeWidth={0} />
);

export type IconComponent = (p: IconProps) => React.ReactElement;
