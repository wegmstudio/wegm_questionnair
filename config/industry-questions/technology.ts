import type { Section } from "@/types/questionnaire";
import { isTrue, list, longText, multi, opts, yesNo } from "../helpers";

export const TECHNOLOGY: Section = {
  id: "industry_technology",
  stepId: "industry",
  industryId: "technology",
  title: "Technology & Startup",
  questions: [
    longText("product_description", "Describe your product or service", { required: true, placeholder: "What it does, who it is for and the problem it solves." }),
    list("product_features", "Key features to highlight", { required: true, placeholder: "e.g. Real-time reports, Team collaboration" }),
    yesNo("pricing_page", "Do you need a pricing page?", { required: true }),
    yesNo("demo_booking", "Should visitors be able to book a demo?", { required: true }),
    multi("lead_generation", "How do you want to capture leads?", opts([["contact_form", "Contact form"], ["newsletter", "Newsletter"], ["free_trial", "Free trial sign-up"], ["download", "Downloadable resource"], ["waitlist", "Waitlist"]]), { display: "checkboxes" }),
    yesNo("user_registration", "Will users register and log in?", { required: true }),
    longText("dashboard_requirements", "What should users see after logging in?", { visibleWhen: isTrue("user_registration"), requiredWhen: isTrue("user_registration"), placeholder: "Describe the dashboard or account area." }),
    list("third_party_integrations", "Tools the website should connect to", { placeholder: "e.g. Stripe, Slack, Google Sheets" }),
    longText("api_requirements", "Any API or data requirements?", { placeholder: "e.g. connect to our existing system, public API for partners", description: "Skip this if you are not sure. We can discuss it on a call." }),
  ],
};
