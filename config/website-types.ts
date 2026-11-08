import type { WebsiteType } from "@/types/questionnaire";

export const WEBSITE_TYPES: WebsiteType[] = [
  { id: "business", name: "Business Website", description: "Present your business, services and contact details.", icon: "Globe" },
  { id: "corporate", name: "Corporate Website", description: "A larger site with teams, departments and news.", icon: "Building" },
  { id: "ecommerce", name: "E-commerce Website", description: "Sell products online with cart and checkout.", icon: "ShoppingCart" },
  { id: "portfolio", name: "Portfolio Website", description: "Showcase your work, projects and achievements.", icon: "Images" },
  { id: "landing", name: "Landing Page", description: "A focused single page for one offer or campaign.", icon: "Megaphone" },
  { id: "booking", name: "Booking Website", description: "Let customers book appointments, tables or rooms.", icon: "CalendarCheck" },
  { id: "catalogue", name: "Catalogue Website", description: "Display products with enquiries instead of checkout.", icon: "BookOpen" },
  { id: "membership", name: "Membership Website", description: "Member sign-up, login and member-only content.", icon: "Users" },
  { id: "blog", name: "Blog or Content Website", description: "Publish articles, news and resources regularly.", icon: "Newspaper" },
  { id: "custom_app", name: "Custom Web Application", description: "A tailored tool, portal or dashboard.", icon: "Code2" },
  { id: "not_sure", name: "Not Sure — Need Guidance", description: "We will recommend the right option together.", icon: "HelpCircle" },
];
