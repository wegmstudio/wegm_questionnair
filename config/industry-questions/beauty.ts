import type { Section } from "@/types/questionnaire";
import { list, opts, single, text, yesNo } from "../helpers";

export const BEAUTY: Section = {
  id: "industry_beauty",
  stepId: "industry",
  industryId: "beauty",
  title: "Beauty & Salon",
  questions: [
    single("salon_type", "What kind of business?", opts([["salon", "Unisex or ladies' salon"], ["spa", "Spa and wellness"], ["barber", "Barber shop"], ["nails", "Nail studio"], ["makeup", "Makeup artist or bridal studio"], ["other", "Other"]]), { required: true }),
    list("salon_services", "Services to list", { required: true, placeholder: "e.g. Haircut, Facial, Bridal makeup" }),
    yesNo("service_pricing", "Show prices for services?", { required: true }),
    yesNo("staff_profiles", "Show staff or artist profiles?"),
    single("salon_appointments", "How should customers book?", opts([["none", "No booking, contact details only"], ["form", "Appointment request form"], ["online", "Online booking with time slots"]]), { required: true }),
    text("working_hours", "Working hours", { placeholder: "e.g. 10am to 8pm, all days" }),
    yesNo("salon_gallery", "Do you want a gallery of your work?", { required: true }),
    yesNo("salon_location", "Show location, map and contact details?"),
  ],
};
