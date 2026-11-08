import type { Step } from "@/types/questionnaire";

export const STEPS: Step[] = [
  { id: "welcome", title: "Welcome", shortTitle: "Welcome", description: "What to expect from this questionnaire.", icon: "Sparkles" },
  { id: "business", title: "Business Information", shortTitle: "Business", description: "Tell us who you are and what your business does.", icon: "Building2" },
  { id: "category", title: "Business Category", shortTitle: "Category", description: "Choose the category that best describes your business.", icon: "LayoutGrid" },
  { id: "website_type", title: "Website Type", shortTitle: "Website type", description: "Select the kind of website you need. You can choose more than one.", icon: "Globe" },
  { id: "industry", title: "Industry-Specific Requirements", shortTitle: "Industry", description: "A few questions tailored to your type of business.", icon: "Layers" },
  { id: "structure", title: "Website Structure", shortTitle: "Structure", description: "The pages and content your website will need.", icon: "FileText" },
  { id: "design", title: "Design Preferences", shortTitle: "Design", description: "How you would like the website to look and feel.", icon: "Palette" },
  { id: "features", title: "Features and Functionality", shortTitle: "Features", description: "What the website should be able to do.", icon: "Blocks" },
  { id: "platform", title: "Platform and Integrations", shortTitle: "Platform", description: "Domain, hosting and tools the website should connect with.", icon: "Plug" },
  { id: "timeline", title: "Timeline and Expectations", shortTitle: "Timeline", description: "When you need the website and what success looks like.", icon: "Clock" },
  { id: "additional", title: "Additional Requirements", shortTitle: "Additional", description: "Anything else we should know before preparing your proposal.", icon: "MessageSquarePlus" },
  { id: "review", title: "Review and Submit", shortTitle: "Review", description: "Check your answers, then download and share your requirements.", icon: "ClipboardCheck" },
];
