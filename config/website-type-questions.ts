import type { Section } from "@/types/questionnaire";
import { COUNT_RANGES, includes, isTrue, list, longText, multi, opts, single, text, yesNo } from "./helpers";

/**
 * Website-type modules. Each section appears only when the matching website
 * type was selected in the Website Type step.
 */
export const WEBSITE_TYPE_SECTIONS: Section[] = [
  {
    id: "module_ecommerce",
    stepId: "features",
    title: "Online store details",
    description: "Because you selected E-commerce Website.",
    visibleWhen: includes("website_types", "ecommerce"),
    questions: [
      single("store_product_count", "How many products will you sell online?", COUNT_RANGES, { required: true }),
      yesNo("shopping_cart", "Customers should add products to a cart and check out on the website", { required: true, description: "Choose No if you would rather take orders by WhatsApp or enquiry." }),
      multi("payment_methods", "Which payment methods should be available?", opts([["cards_upi", "Cards and UPI"], ["net_banking", "Net banking"], ["wallets", "Wallets (e.g. Paytm, PhonePe)"], ["cod", "Cash on Delivery"], ["unsure", "Not sure, please advise"]]), { display: "checkboxes", visibleWhen: isTrue("shopping_cart"), requiredWhen: isTrue("shopping_cart") }),
      yesNo("cash_on_delivery", "Do you want to offer Cash on Delivery?", { visibleWhen: isTrue("shopping_cart") }),
      single("shipping_scope", "Where will you ship?", opts([["local", "Within my city"], ["national", "Across the country"], ["international", "International"], ["pickup", "Store pickup only"]]), { visibleWhen: isTrue("shopping_cart"), requiredWhen: isTrue("shopping_cart") }),
      yesNo("courier_integration", "Should the website connect to a courier or shipping service?", { visibleWhen: isTrue("shopping_cart"), description: "For example to create shipments and print labels automatically." }),
      list("courier_providers", "Which courier providers?", { visibleWhen: isTrue("courier_integration"), placeholder: "e.g. Delhivery, Shiprocket, DTDC" }),
      yesNo("order_tracking", "Should customers be able to track their orders?", { visibleWhen: isTrue("shopping_cart") }),
      yesNo("returns_policy", "Do you need returns or refund handling on the website?", { visibleWhen: isTrue("shopping_cart") }),
    ],
  },
  {
    id: "module_booking",
    stepId: "features",
    title: "Booking details",
    description: "Because you selected Booking Website.",
    visibleWhen: includes("website_types", "booking"),
    questions: [
      text("booking_items", "What will customers book?", { required: true, placeholder: "e.g. appointments, tables, rooms, classes, consultations" }),
      yesNo("booking_calendar", "Show live availability on a calendar?", { required: true, description: "If No, bookings arrive as requests that you confirm." }),
      single("booking_duration", "How are booking slots organised?", opts([["fixed", "Fixed time slots"], ["flexible", "Flexible start times"], ["daily", "Whole days or nights"]])),
      yesNo("booking_staff", "Can customers choose a specific person or resource?", { description: "e.g. a particular stylist, doctor or room." }),
      multi("booking_confirmation", "How should bookings be confirmed?", opts([["email", "Email"], ["whatsapp", "WhatsApp"], ["sms", "SMS"], ["call", "Phone call from us"]]), { display: "checkboxes" }),
      single("booking_payment", "Should customers pay when they book?", opts([["none", "No payment on the website"], ["deposit", "A deposit or advance"], ["full", "Full payment"]]), { required: true }),
    ],
  },
  {
    id: "module_membership",
    stepId: "features",
    title: "Membership details",
    description: "Because you selected Membership Website.",
    visibleWhen: includes("website_types", "membership"),
    questions: [
      yesNo("member_registration", "Should visitors be able to register on the website?", { required: true }),
      yesNo("member_login", "Do members need a login area?", { required: true }),
      list("membership_tiers", "Membership plans or tiers", { placeholder: "e.g. Monthly, Annual, Premium" }),
      longText("member_content", "What do members get access to?", { placeholder: "e.g. videos, documents, events, discounts" }),
      yesNo("recurring_payments", "Do you need recurring (subscription) payments?"),
    ],
  },
  {
    id: "module_catalogue",
    stepId: "features",
    title: "Catalogue details",
    description: "Because you selected Catalogue Website.",
    visibleWhen: includes("website_types", "catalogue"),
    questions: [
      text("catalogue_items", "What will the catalogue show?", { required: true, placeholder: "e.g. furniture, machinery, fabrics, services" }),
      single("catalogue_count", "How many items?", COUNT_RANGES),
      multi("catalogue_details", "What should each item include?", opts([["specs", "Specifications"], ["prices", "Prices"], ["downloads", "Downloadable files or brochures"], ["variants", "Variants (sizes, colours, models)"], ["enquiry", "An enquiry button per item"]]), { display: "checkboxes" }),
      single("catalogue_enquiry", "How should customers enquire?", opts([["form", "Enquiry form"], ["whatsapp", "WhatsApp"], ["both", "Both"]]), { required: true }),
    ],
  },
  {
    id: "module_portfolio",
    stepId: "features",
    title: "Portfolio details",
    description: "Because you selected Portfolio Website.",
    visibleWhen: includes("website_types", "portfolio"),
    questions: [
      single("portfolio_count", "How many projects or pieces will you show?", opts([["1_10", "1 to 10"], ["11_30", "11 to 30"], ["30_plus", "More than 30"]])),
      list("portfolio_categories", "Project categories", { placeholder: "e.g. Weddings, Interiors, Branding" }),
      yesNo("case_studies", "Do you want detailed case studies for selected projects?"),
      multi("portfolio_media", "What media will you show?", opts([["images", "Images"], ["video", "Video"], ["before_after", "Before and after"], ["documents", "Documents or PDFs"]]), { display: "checkboxes" }),
    ],
  },
  {
    id: "module_landing",
    stepId: "features",
    title: "Landing page details",
    description: "Because you selected Landing Page.",
    visibleWhen: includes("website_types", "landing"),
    questions: [
      single("landing_goal", "What is the main goal of the landing page?", opts([["leads", "Collect enquiries or leads"], ["signups", "Sign-ups or registrations"], ["sales", "Sell one product or offer"], ["event", "Promote an event"], ["app", "App downloads"]]), { required: true }),
      text("landing_cta", "What should the main button say?", { placeholder: "e.g. Book a free demo, Get the offer" }),
      multi("lead_fields", "What should the enquiry form collect?", opts([["name", "Name"], ["phone", "Phone"], ["email", "Email"], ["city", "City"], ["message", "Message"], ["custom", "Something else"]]), { display: "checkboxes" }),
    ],
  },
  {
    id: "module_blog",
    stepId: "features",
    title: "Blog and content details",
    description: "Because you selected Blog or Content Website.",
    visibleWhen: includes("website_types", "blog"),
    questions: [
      list("blog_categories", "Content categories", { placeholder: "e.g. News, Guides, Recipes" }),
      single("blog_authors", "Who will publish content?", opts([["one", "One person"], ["several", "Several authors"]])),
      yesNo("comments", "Allow readers to comment?"),
      single("publishing_frequency", "How often will you publish?", opts([["weekly", "Weekly or more"], ["monthly", "A few times a month"], ["occasionally", "Occasionally"]])),
    ],
  },
  {
    id: "module_custom_app",
    stepId: "features",
    title: "Custom web application",
    description: "Because you selected Custom Web Application.",
    visibleWhen: includes("website_types", "custom_app"),
    questions: [
      longText("app_description", "Describe what the application should do", { required: true, placeholder: "Walk us through the main tasks users will perform, step by step." }),
      list("app_user_roles", "Types of users", { placeholder: "e.g. Admin, Staff, Customer" }),
      yesNo("app_dashboard", "Do users need a dashboard with reports or summaries?"),
      longText("app_existing_process", "How is this handled today?", { placeholder: "e.g. spreadsheets, WhatsApp groups, another software" }),
    ],
  },
];
