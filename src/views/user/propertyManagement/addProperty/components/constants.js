import {
  Home,
  Image as ImageIcon,
  ClipboardList,
  DollarSign,
  Grid3x3,
  MapPin,
  User,
  Plus,
  Wifi,
  Package,
  Coffee,
  Fan,
  Tv,
  Gamepad2,
  DoorOpen,
  Microwave,
  Waves,
  Umbrella,
  ChefHat,
  Monitor,
  Dumbbell,
  Refrigerator,
  Shield,
  Sunset,
  Trees,
  Mountain,
  Sunrise
} from 'lucide-react';

export const sections = [
  { id: 'basic', label: 'Basic Info', icon: Home },
  { id: 'media', label: 'Media', icon: ImageIcon },
  { id: 'details', label: 'Details', icon: ClipboardList },
  { id: 'pricing', label: 'Pricing', icon: DollarSign },
  { id: 'facilities', label: 'Facilities', icon: Grid3x3 },
  { id: 'location', label: 'Location', icon: MapPin },
  { id: 'owner', label: 'Owner', icon: User },
  { id: 'additional', label: 'Additional', icon: Plus }
];

export const facilityIcons = {
  wifi: Wifi,
  washing_machine: Package,
  coffee_maker: Coffee,
  celling_fan: Fan,
  kettle: Coffee,
  air_conditioning: Fan,
  tv: Tv,
  game_console: Gamepad2,
  private_entrance: DoorOpen,
  microwave: Microwave,
  pool: Waves,
  beach_access: Umbrella,
  drying_machine: ChefHat,
  workspace_area: Monitor,
  toaster: ChefHat,
  kitchen: ChefHat,
  gym: Dumbbell,
  refrigenerator: Refrigerator,
  fridge: Refrigerator,
  security: Shield
};

export const viewIcons = {
  ocean_view: Waves,
  sunset_view: Sunset,
  garden_view: Trees,
  beach_view: Umbrella,
  jungle_view: Trees,
  montain_view: Mountain,
  pool_view: Waves,
  rice_field: Trees,
  sunrise_view: Sunrise,
  volcano_view: Mountain
};
