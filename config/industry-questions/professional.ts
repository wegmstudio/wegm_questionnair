import type { Section } from "@/types/questionnaire";
import { list, opts, single, yesNo } from "../helpers";

export const PROFESSIONAL: Section = {
  id: "industry_professional",
  stepId: "industry",
  industryId: "professional",
  title: "Professional Services",
  questions: [
    single("service_field", "Which field are you in?", opts([["legal", "Legal"], ["accounting", "Accounting and tax"], ["consulting", "Consulting"], ["architecture", "Architecture and interiors"], ["marketing", "Marketing and design"], ["it", "IT and software services"], ["other", "Other"]]), { required: true }),
    list("services_offered", "Services to list on the website", { required: true, placeholder: "e.g. Company registration, GST filing, Audits" }),
    yesNo("team_profiles", "Show team or partner profiles?", { required: true }),
    yesNo("consultation_booking", "Should visitors be able to book a consultation?", { required: true }),
    single("service_descriptions", "Do you have written descriptions of your services?", opts([["have", "Yes, ready to use"], ["partial", "Partly"], ["need_help", "No, we need help writing them"]]), { required: true }),
    yesNo("case_studies_pro", "Show case studies or client work?"),
    yesNo("enquiry_forms", "Do you need enquiry forms?", { required: true }),
    yesNo("testimonials_pro", "Show client testimonials?"),
  ],
};
