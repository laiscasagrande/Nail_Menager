import { Sparkles, HandCoins, ChartColumnBig, Settings, Clock, Coffee, UsersRound, Filter } from 'lucide-react-native';

export const ICONS = {
  filter: (color, size) => (
    <Filter size={size} color='#FFFFFF' />
  ),
  clock: (color, size) => (
    <Clock size={size} color='#FFFFFF' />
  ),
  coffee: (color, size) => (
    <Coffee size={size} color='#FFFFFF' />
  ),
  usersRound: (color, size) => (
    <UsersRound size={size} color='#FFFFFF' />
  ),
  sparkles: (color, size) => (
    <Sparkles size={size} color='#FFFFFF' />
  ),
  handCoins: (color, size) => (
    <HandCoins size={size} color='#FFFFFF' />
  ),
  chartColumnBig: (color, size) => (
    <ChartColumnBig size={size} color='#FFFFFF' />
  ),
  settings: (color, size) => (
    <Settings size={size} color='#FFFFFF' />
  ),
};