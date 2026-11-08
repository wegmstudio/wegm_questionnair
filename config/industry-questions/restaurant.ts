import type { Section } from "@/types/questionnaire";
import { READINESS, isTrue, list, multi, opts, single, text, yesNo } from "../helpers";

export const RESTAURANT: Section = {
  id: "industry_restaurant",
  stepId: "industry",
  industryId: "restaurant",
  title: "Restaurant & Cafe",
  questions: [
    single("restaurant_type", "What type of place is it?", opts([["restaurant", "Restaurant"], ["cafe", "Cafe"], ["bakery", "Bakery or dessert shop"], ["cloud_kitchen", "Cloud kitchen"], ["bar", "Bar or lounge"], ["other", "Other"]]), { required: true }),
    list("menu_categories", "Menu categories", { required: true, placeholder: "e.g. Starters, Mains, Desserts, Beverages" }),
    yesNo("digital_menu", "Do you want a digital menu on the website?", { required: true, description: "Customers can browse dishes, photos and prices." }),
    yesNo("online_ordering", "Should customers be able to order online?", { required: true }),
    multi("ordering_payment", "How should customers pay for online orders?", opts([["online", "Pay online"], ["on_delivery", "Pay on delivery"], ["at_pickup", "Pay at pickup"]]), { display: "checkboxes", visibleWhen: isTrue("online_ordering"), requiredWhen: isTrue("online_ordering") }),
    single("delivery_model", "How will orders reach customers?", opts([["own", "Our own delivery team"], ["third_party", "Third-party delivery partners"], ["pickup", "Pickup only"], ["both", "Delivery and pickup"]]), { visibleWhen: isTrue("online_ordering"), requiredWhen: isTrue("online_ordering") }),
    yesNo("table_reservations", "Do you want table reservations?", { required: true }),
    single("reservation_method", "How should reservations work?", opts([["form", "A simple request form"], ["whatsapp", "Via WhatsApp"], ["calendar", "Live availability with confirmation"]]), { visibleWhen: isTrue("table_reservations"), requiredWhen: isTrue("table_reservations") }),
    single("branch_count", "How many branches or locations?", opts([["1", "One"], ["2_5", "2 to 5"], ["6_plus", "6 or more"]]), { required: true }),
    text("opening_hours", "Opening hours", { placeholder: "e.g. 11am to 11pm, closed on Mondays" }),
    single("food_images", "Do you have food photos?", READINESS, { required: true }),
    yesNo("whatsapp_ordering", "Would you like a WhatsApp ordering button?"),
  ],
};
