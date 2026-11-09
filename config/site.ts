import type { WorkspacePreferences } from "@/types/questionnaire";

/**
 * Public contact details shown in the app. Nothing here is secret.
 * The owner can override these in the local Workspace > Settings tab.
 * Confirm the WhatsApp number includes the country code (e.g. 91 for India).
 */
export const DEFAULT_PREFERENCES: WorkspacePreferences = {
  studioName: "WEGM Studio",
  whatsappNumber: "918073542692",
  instagramUrl: "https://www.instagram.com/wegmstudio/",
  websiteUrl: "https://wegmstudio.shop",
  contactEmail: "",
};

export const BRAND = {
  name: "WEGM Studio",
  tagline: "WE IMAGINE. WE CREATE.",
};
