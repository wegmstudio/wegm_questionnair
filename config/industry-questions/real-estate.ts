import type { Section } from "@/types/questionnaire";
import { multi, opts, single, yesNo } from "../helpers";

export const REAL_ESTATE: Section = {
  id: "industry_real_estate",
  stepId: "industry",
  industryId: "real_estate",
  title: "Real Estate",
  questions: [
    multi("property_categories", "What kinds of properties do you deal with?", opts([["apartments", "Apartments and flats"], ["villas", "Villas and independent houses"], ["plots", "Plots and land"], ["commercial", "Commercial spaces"], ["rentals", "Rentals"], ["coliving", "PG or co-living"]]), { required: true, display: "checkboxes" }),
    single("property_kind", "Residential, commercial or both?", opts([["residential", "Residential"], ["commercial", "Commercial"], ["both", "Both"]]), { required: true }),
    single("listing_count", "How many property listings will the website have?", opts([["1_10", "1 to 10"], ["11_50", "11 to 50"], ["51_200", "51 to 200"], ["200_plus", "More than 200"]]), { required: true }),
    multi("property_filters", "How should visitors filter properties?", opts([["location", "Location"], ["price", "Price range"], ["bedrooms", "Bedrooms"], ["type", "Property type"], ["status", "Ready / under construction"], ["furnishing", "Furnishing"]]), { display: "checkboxes" }),
    yesNo("property_detail_pages", "Should each property have its own detail page?", { required: true }),
    yesNo("property_map", "Show property locations on a map?"),
    multi("property_enquiry", "How should visitors enquire?", opts([["form", "Enquiry form"], ["whatsapp", "WhatsApp"], ["call", "Click-to-call"], ["site_visit", "Site visit request"]]), { required: true, display: "checkboxes" }),
    yesNo("agent_profiles", "Show agent or team profiles?"),
    single("property_galleries", "What media will each property have?", opts([["images", "Images"], ["images_video", "Images and video"], ["virtual_tour", "Images, video and virtual tours"]])),
  ],
};
