import type { Industry } from "@/types/questionnaire";

export const INDUSTRIES: Industry[] = [
  { id: "retail", name: "Retail & Clothing", description: "Shops, boutiques, fashion and product brands.", icon: "Shirt", enabled: true },
  { id: "restaurant", name: "Restaurant & Cafe", description: "Restaurants, cafes, bakeries and cloud kitchens.", icon: "UtensilsCrossed", enabled: true },
  { id: "gym", name: "Gym & Fitness", description: "Gyms, studios, trainers and wellness centres.", icon: "Dumbbell", enabled: true },
  { id: "real_estate", name: "Real Estate", description: "Agents, builders, developers and rentals.", icon: "Building2", enabled: true },
  { id: "healthcare", name: "Healthcare & Clinic", description: "Clinics, hospitals, dental and diagnostic centres.", icon: "Stethoscope", enabled: true },
  { id: "education", name: "Education & Coaching", description: "Schools, coaching centres, tutors and academies.", icon: "GraduationCap", enabled: true },
  { id: "travel", name: "Travel & Hospitality", description: "Hotels, resorts, homestays and travel agencies.", icon: "Plane", enabled: true },
  { id: "professional", name: "Professional Services", description: "Consultants, agencies, legal, finance and IT services.", icon: "Briefcase", enabled: true },
  { id: "events", name: "Events & Weddings", description: "Weddings, conferences, celebrations and planners.", icon: "PartyPopper", enabled: true },
  { id: "beauty", name: "Beauty & Salon", description: "Salons, spas, barbers and beauty studios.", icon: "Scissors", enabled: true },
  { id: "technology", name: "Technology & Startup", description: "Software products, apps and new ventures.", icon: "Rocket", enabled: true },
  { id: "other", name: "Other Business", description: "Something different? Tell us about it.", icon: "Store", enabled: true },
];
