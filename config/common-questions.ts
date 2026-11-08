import type { Section } from "@/types/questionnaire";
import { COUNT_RANGES, READINESS, all, any, equals, includes, isTrue, list, longText, multi, opts, q, single, text, when, yesNo } from "./helpers";

/** Questions every customer answers, regardless of category. */
export const COMMON_SECTIONS: Section[] = [
  {
    id: "business_info",
    stepId: "business",
    title: "About you and your business",
    description: "We use these details to prepare your proposal and get back to you.",
    questions: [
      text("contact_name", "Your name", { required: true, placeholder: "e.g. Priya Sharma" }),
      text("business_name", "Business or brand name", { required: true, placeholder: "e.g. Priya's Boutique" }),
      q("contact_email", "Email address", "email", { required: true, placeholder: "you@example.com" }),
      q("contact_phone", "WhatsApp or phone number", "phone", { required: true, placeholder: "+91 98765 43210", description: "Include your country code so we can reach you on WhatsApp." }),
      text("business_location", "City and country", { placeholder: "e.g. Bengaluru, India" }),
      longText("business_description", "Tell us about your business", { required: true, placeholder: "What do you offer, and what makes it special?", description: "A few sentences are enough. This helps us understand your goals before we look at the details." }),
      longText("target_customers", "Who are your customers?", { placeholder: "e.g. young professionals in Bengaluru, wholesale buyers, families" }),
      single("business_stage", "Where is your business today?", opts([["new", "Just starting out"], ["established", "Established and running"], ["expanding", "Expanding or launching something new"]])),
    ],
  },
  {
    id: "category_choice",
    stepId: "category",
    title: "Choose your business category",
    questions: [q("business_category", "Business category", "single_choice", { required: true, optionsSource: "industries", display: "cards", description: "Pick the closest match. This unlocks questions specific to your industry." })],
  },
  {
    id: "other_business",
    stepId: "category",
    title: "Tell us about your business type",
    visibleWhen: equals("business_category", "other"),
    questions: [
      text("other_business_type", "What type of business is it?", { required: true, placeholder: "e.g. Pet grooming, Logistics, Non-profit" }),
      longText("other_business_description", "Describe what the business does", { required: true, placeholder: "Who you serve, what you offer and how customers find you today." }),
    ],
  },
  {
    id: "website_type_choice",
    stepId: "website_type",
    title: "What kind of website do you need?",
    questions: [q("website_types", "Website type", "multi_choice", { required: true, optionsSource: "websiteTypes", display: "cards", description: "Select everything that applies. Each choice adds a few relevant questions later." })],
  },
  {
    id: "guidance",
    stepId: "website_type",
    title: "Help us guide you",
    description: "No problem if you are not sure yet. A little context lets us recommend the right type of website.",
    visibleWhen: includes("website_types", "not_sure"),
    questions: [
      longText("guidance_goal", "What do you want the website to do for your business?", { required: true, placeholder: "e.g. get more enquiries, sell products, look more professional, take bookings" }),
      list("guidance_examples", "Websites you like (optional)", { placeholder: "example.com", description: "Add any site you like, even from another industry." }),
    ],
  },
  {
    id: "pages",
    stepId: "structure",
    title: "Pages",
    questions: [
      multi(
        "pages",
        "Which pages should the website have?",
        opts([
          ["home", "Home"],
          ["about", "About"],
          ["services", "Services"],
          ["products", "Products"],
          ["portfolio", "Portfolio"],
          ["gallery", "Gallery"],
          ["blog", "Blog"],
          ["contact", "Contact"],
          ["faq", "FAQ"],
          ["testimonials", "Testimonials"],
          ["privacy", "Privacy Policy"],
          ["terms", "Terms and Conditions"],
          ["other", "Other custom pages"],
        ]),
        { required: true, display: "checkboxes", description: "Choose the pages you already know you need. We can refine this together later." },
      ),
      list("custom_pages", "Custom page names", { visibleWhen: includes("pages", "other"), requiredWhen: includes("pages", "other"), placeholder: "e.g. Careers, Franchise, Menu" }),
      single("page_count", "Roughly how many pages in total?", opts([["1_5", "1 to 5"], ["6_10", "6 to 10"], ["11_20", "11 to 20"], ["20_plus", "More than 20"], ["unsure", "Not sure yet"]])),
    ],
  },
  {
    id: "content",
    stepId: "structure",
    title: "Content",
    questions: [
      single("content_status", "Do you have the text for your pages?", READINESS, { required: true, description: "Headlines, descriptions, service details and so on." }),
      single("images_status", "Do you have photos and images?", opts([["professional", "Yes, professional photos"], ["some", "Some, but not for everything"], ["none", "No, we will need stock images or a photoshoot"]]), { required: true }),
    ],
  },
  {
    id: "style",
    stepId: "design",
    title: "Look and feel",
    questions: [
      multi(
        "design_styles",
        "Which styles appeal to you?",
        opts([["minimal", "Minimal"], ["modern", "Modern"], ["corporate", "Corporate"], ["premium", "Premium"], ["creative", "Creative"], ["luxury", "Luxury"], ["colourful", "Colourful"], ["not_sure", "Not sure"]]),
        { required: true, display: "checkboxes" },
      ),
      text("preferred_colours", "Preferred colours", { placeholder: "e.g. navy and gold, soft pastels, our brand colours" }),
      list("reference_websites", "Websites you like", { placeholder: "example.com", description: "Links to sites whose look or layout you admire. These are references, not templates." }),
      longText("design_notes", "Anything you want to avoid or insist on?", { placeholder: "e.g. no dark backgrounds, keep it very simple, must feel premium" }),
    ],
  },
  {
    id: "branding",
    stepId: "design",
    title: "Branding assets",
    questions: [
      yesNo("has_logo", "Do you have a logo?", { required: true }),
      q("logo_file", "Upload your logo", "file", { visibleWhen: isTrue("has_logo"), accept: [".png", ".jpg", ".jpeg", ".svg", ".pdf"], maxFiles: 2, maxFileSizeMb: 5, description: "PNG, JPG, SVG or PDF up to 5 MB. Files stay in your browser and are listed by name in the PDF." }),
      yesNo("brand_guidelines", "Do you have brand guidelines or a brand kit?", { description: "Fonts, colours, tone of voice or a style guide." }),
      q("reference_files", "Reference files (optional)", "file", { accept: [".png", ".jpg", ".jpeg", ".pdf"], maxFiles: 5, maxFileSizeMb: 10, description: "Screenshots, sketches or brochures that show what you have in mind." }),
    ],
  },
  {
    id: "feature_list",
    stepId: "features",
    title: "Website features",
    questions: [
      multi(
        "features",
        "Which features do you need?",
        opts([
          ["whatsapp", "WhatsApp integration", "A chat button that opens WhatsApp"],
          ["contact_forms", "Contact forms"],
          ["google_maps", "Google Maps"],
          ["search", "Search"],
          ["blog", "Blog"],
          ["gallery", "Gallery"],
          ["testimonials", "Testimonials"],
          ["newsletter", "Newsletter sign-up"],
          ["live_chat", "Live chat"],
          ["customer_login", "Customer login"],
          ["admin_dashboard", "Admin dashboard", "A place for you to update content yourself"],
          ["analytics", "Analytics", "Visitor statistics such as Google Analytics"],
          ["seo_basics", "SEO basics", "Search-friendly titles, descriptions and structure"],
          ["multilingual", "Multilingual support"],
        ]),
        { display: "checkboxes", description: "Tick everything you would like. Unsure items can be discussed later." },
      ),
      list("languages", "Which languages?", { visibleWhen: includes("features", "multilingual"), requiredWhen: includes("features", "multilingual"), placeholder: "e.g. English, Kannada, Hindi" }),
    ],
  },
  {
    id: "domain_hosting",
    stepId: "platform",
    title: "Domain and hosting",
    description: "Plain-language versions: your domain is your web address, and hosting is where the website files live.",
    questions: [
      yesNo("existing_domain", "Do you already own a domain name?", { required: true, description: "For example yourbusiness.com" }),
      text("domain_name", "Your domain name", { visibleWhen: isTrue("existing_domain"), requiredWhen: isTrue("existing_domain"), placeholder: "yourbusiness.com" }),
      yesNo("existing_hosting", "Do you already have website hosting?", { required: true, description: "If you are not sure, choose No and we will advise you." }),
      text("hosting_provider", "Hosting provider", { visibleWhen: isTrue("existing_hosting"), placeholder: "e.g. Hostinger, GoDaddy, AWS" }),
      yesNo("business_email", "Do you have a business email on your domain?", { description: "e.g. hello@yourbusiness.com rather than a Gmail address." }),
    ],
  },
  {
    id: "platform_choice",
    stepId: "platform",
    title: "Platform and existing website",
    questions: [
      single("preferred_platform", "Do you have a preferred platform?", opts([["no_preference", "No preference, recommend the best fit"], ["wordpress", "WordPress"], ["shopify", "Shopify"], ["custom", "Custom-built website"], ["other", "Other"]]), { required: true, description: "The platform is the system the website is built on. Most customers leave this to us." }),
      text("platform_other", "Which platform?", { visibleWhen: equals("preferred_platform", "other"), requiredWhen: equals("preferred_platform", "other") }),
      yesNo("existing_website", "Do you have a website today?", { required: true }),
      q("existing_website_url", "Current website address", "url", { visibleWhen: isTrue("existing_website"), requiredWhen: isTrue("existing_website"), placeholder: "yourbusiness.com" }),
      single("project_kind", "Is this a new website or a redesign?", opts([["new", "A brand-new website"], ["redesign", "A redesign of the current website"], ["improve", "Improvements to the current website"]]), { visibleWhen: isTrue("existing_website"), requiredWhen: isTrue("existing_website") }),
    ],
  },
  {
    id: "integrations",
    stepId: "platform",
    title: "Third-party integrations",
    questions: [
      multi(
        "integrations",
        "Should the website connect with any other tools?",
        opts([
          ["payment_gateway", "Payment gateway", "e.g. Razorpay, PayU, Stripe"],
          ["google_analytics", "Google Analytics"],
          ["crm", "CRM or lead management", "e.g. HubSpot, Zoho"],
          ["email_marketing", "Email marketing", "e.g. Mailchimp"],
          ["social_feeds", "Social media feeds", "e.g. Instagram posts on the site"],
          ["booking_tools", "Booking or calendar tools"],
          ["other", "Other"],
          ["none", "None that I know of"],
        ]),
        { display: "checkboxes" },
      ),
      longText("integrations_other", "Tell us about the other tools", { visibleWhen: includes("integrations", "other"), requiredWhen: includes("integrations", "other") }),
    ],
  },
  {
    id: "timeline_section",
    stepId: "timeline",
    title: "Timeline",
    questions: [
      single("timeline", "When would you like the website to be live?", opts([["asap", "As soon as possible"], ["2_weeks", "Within 2 weeks"], ["1_month", "Within 1 month"], ["2_3_months", "Within 2 to 3 months"], ["flexible", "Flexible"]]), { required: true, display: "radio" }),
      text("launch_reason", "Is there a date or event behind this timeline?", { placeholder: "e.g. store opening on 15 March, festive season, product launch" }),
    ],
  },
  {
    id: "expectations",
    stepId: "timeline",
    title: "Expectations",
    questions: [
      longText("success_definition", "What would make this website a success for you?", { required: true, placeholder: "e.g. more WhatsApp enquiries, online orders, a professional first impression" }),
      single("decision_process", "Who will approve the design and content?", opts([["me", "Just me"], ["team", "A small team"], ["approval", "It needs approval from others"]])),
      yesNo("ongoing_support", "Would you like ongoing updates and maintenance after launch?", { description: "This helps us plan the hand-over. It does not commit you to anything." }),
    ],
  },
  {
    id: "extra",
    stepId: "additional",
    title: "Anything else?",
    questions: [
      longText("additional_requirements", "Additional requirements or ideas", { placeholder: "Anything we have not asked about, questions you have, or ideas you would like to explore." }),
      single("heard_about", "How did you hear about WEGM Studio?", opts([["instagram", "Instagram"], ["whatsapp", "WhatsApp"], ["referral", "A friend or referral"], ["google", "Google search"], ["other", "Other"]])),
      single("preferred_contact", "How should we contact you?", opts([["whatsapp", "WhatsApp"], ["phone", "Phone call"], ["email", "Email"]]), { required: true, display: "radio" }),
      yesNo("privacy_ack", "I understand that this questionnaire runs in my browser and that I need to download and share the requirements PDF with WEGM Studio myself.", { required: true, mustBeTrue: true }),
    ],
  },
];

// Re-exported for the workspace rule editor examples.
export const EXAMPLE_RULE = any(all(when("website_types", "contains", "ecommerce")), all(when("sell_online", "equals", true)));
