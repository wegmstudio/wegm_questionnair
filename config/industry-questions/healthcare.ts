import type { Section } from "@/types/questionnaire";
import { list, opts, single, text, yesNo } from "../helpers";

export const HEALTHCARE: Section = {
  id: "industry_healthcare",
  stepId: "industry",
  industryId: "healthcare",
  title: "Healthcare & Clinic",
  description: "We only ask about the website. Please do not share any patient records or medical information here.",
  questions: [
    single("clinic_type", "What type of practice is it?", opts([["clinic", "General clinic"], ["hospital", "Hospital"], ["dental", "Dental"], ["physio", "Physiotherapy"], ["diagnostic", "Diagnostic centre"], ["specialist", "Specialist practice"], ["other", "Other"]]), { required: true }),
    yesNo("doctor_profiles", "Show doctor or practitioner profiles?", { required: true }),
    list("departments", "Departments or specialities", { placeholder: "e.g. Orthopaedics, Paediatrics, Dermatology" }),
    single("appointment_booking", "How should patients book appointments?", opts([["none", "No online booking, just contact details"], ["request", "An appointment request form"], ["live", "Live slots with confirmation"]]), { required: true }),
    yesNo("consultation_info", "Show consultation types and general information?", { description: "e.g. in-person vs. online consultations, what to bring." }),
    text("clinic_timings", "Clinic timings", { placeholder: "e.g. Mon to Sat, 9am to 7pm" }),
    yesNo("clinic_location", "Show location with directions on a map?"),
    yesNo("clinic_contact_forms", "Do you need a general contact form?"),
  ],
};
