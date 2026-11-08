import {
  Blocks, BookOpen, Briefcase, Building, Building2, CalendarCheck, ClipboardCheck, Clock, Code2, Dumbbell, FileText, Globe, GraduationCap, HelpCircle, Images, LayoutGrid, Layers, Megaphone, MessageSquarePlus, Newspaper, Palette, PartyPopper, Plane, Plug, Rocket, Scissors, Shirt, ShoppingCart, Sparkles, Stethoscope, Store, Users, UtensilsCrossed, type LucideProps,
} from "lucide-react";

/** Icons referenced by name from configuration data. Keep this list small so the bundle stays light. */
export const ICONS = {
  Blocks, BookOpen, Briefcase, Building, Building2, CalendarCheck, ClipboardCheck, Clock, Code2, Dumbbell, FileText, Globe, GraduationCap, HelpCircle, Images, LayoutGrid, Layers, Megaphone, MessageSquarePlus, Newspaper, Palette, PartyPopper, Plane, Plug, Rocket, Scissors, Shirt, ShoppingCart, Sparkles, Stethoscope, Store, Users, UtensilsCrossed,
} as const;

export type IconName = keyof typeof ICONS;
export const ICON_NAMES = Object.keys(ICONS) as IconName[];

export function Icon({ name, ...props }: { name?: string } & LucideProps) {
  const Component = (name && (ICONS as Record<string, React.ComponentType<LucideProps>>)[name]) || Globe;
  return <Component aria-hidden {...props} />;
}
