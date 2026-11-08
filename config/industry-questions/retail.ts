import type { Section } from "@/types/questionnaire";
import { COUNT_RANGES, READINESS, isTrue, list, longText, multi, opts, single, yesNo } from "../helpers";

export const RETAIL: Section = {
  id: "industry_retail",
  stepId: "industry",
  industryId: "retail",
  title: "Retail & Clothing",
  description: "Selling, payment and shipping questions appear in the Features step if you selected E-commerce Website.",
  questions: [
    longText("product_types", "What products will you offer?", { required: true, placeholder: "e.g. women's ethnic wear, kids' clothing, accessories" }),
    single("product_quantity", "Roughly how many products?", COUNT_RANGES, { required: true }),
    yesNo("sell_online", "Do you want customers to buy directly on the website?", { required: true, description: "Choose No if the website should only show products and collect enquiries." }),
    yesNo("product_sizes_colours", "Do products come in different sizes or colours?", { required: true }),
    longText("product_variations", "Describe the variations", { visibleWhen: isTrue("product_sizes_colours"), placeholder: "e.g. sizes S to XXL, 4 colours per design" }),
    yesNo("inventory_management", "Do you need to track stock levels on the website?"),
    single("product_images", "Do you have product photos?", READINESS, { required: true }),
    multi("product_filters", "How should customers filter products?", opts([["category", "Category"], ["price", "Price"], ["size", "Size"], ["colour", "Colour"], ["brand", "Brand"], ["new", "New arrivals"]]), { display: "checkboxes" }),
    yesNo("wishlist", "Should customers be able to save items to a wishlist?"),
    yesNo("customer_accounts", "Should customers be able to create accounts?"),
    list("retail_notes", "Anything else about your products?", { placeholder: "e.g. pre-orders, gift wrapping, bulk orders" }),
  ],
};
