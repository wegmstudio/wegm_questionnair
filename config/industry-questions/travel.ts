import type { Section } from "@/types/questionnaire";
import { any, isTrue, list, multi, opts, single, when, yesNo } from "../helpers";

const IS_STAY = any(when("hospitality_type", "equals", "hotel"), when("hospitality_type", "equals", "resort"), when("hospitality_type", "equals", "homestay"));

export const TRAVEL: Section = {
  id: "industry_travel",
  stepId: "industry",
  industryId: "travel",
  title: "Travel & Hospitality",
  questions: [
    single("hospitality_type", "What type of business?", opts([["hotel", "Hotel"], ["resort", "Resort"], ["homestay", "Homestay or villa"], ["agency", "Travel agency"], ["tour_operator", "Tour operator"]]), { required: true }),
    list("room_categories", "Room categories", { visibleWhen: IS_STAY, requiredWhen: IS_STAY, placeholder: "e.g. Deluxe, Suite, Family room" }),
    yesNo("room_availability", "Show live room availability?", { visibleWhen: IS_STAY }),
    single("booking_requirements", "How should guests book?", opts([["enquiry", "Enquiry only"], ["request", "Booking request we confirm"], ["instant", "Instant online booking"]]), { required: true }),
    yesNo("travel_packages", "Do you offer packages or tours?", { required: true }),
    single("package_count", "How many packages?", opts([["1_10", "1 to 10"], ["11_30", "11 to 30"], ["30_plus", "More than 30"]]), { visibleWhen: isTrue("travel_packages") }),
    list("destinations", "Destinations to feature", { placeholder: "e.g. Coorg, Goa, Bali" }),
    multi("facilities", "Facilities to highlight", opts([["pool", "Pool"], ["spa", "Spa"], ["restaurant", "Restaurant"], ["wifi", "Wi-Fi"], ["parking", "Parking"], ["transport", "Airport transfers"], ["events", "Event spaces"]]), { display: "checkboxes", visibleWhen: IS_STAY }),
    multi("booking_enquiries", "How should enquiries arrive?", opts([["form", "Website form"], ["whatsapp", "WhatsApp"], ["phone", "Phone"]]), { required: true, display: "checkboxes" }),
    yesNo("travel_reviews", "Show guest reviews or ratings?"),
  ],
};
