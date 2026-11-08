import type { Section } from "@/types/questionnaire";
import { list, longText } from "../helpers";

export const OTHER: Section = {
  id: "industry_other",
  stepId: "industry",
  industryId: "other",
  title: "Your business",
  description: "Because every business is different, tell us in your own words.",
  questions: [
    longText("required_functionality", "What should the website let visitors do?", { required: true, placeholder: "e.g. browse services, request quotes, download brochures, book a slot" }),
    list("custom_features", "Specific features you have in mind", { placeholder: "e.g. price calculator, member directory" }),
    longText("other_industry_notes", "Anything else specific to your industry?", { placeholder: "Regulations, seasonal demand, how customers usually find you." }),
  ],
};
