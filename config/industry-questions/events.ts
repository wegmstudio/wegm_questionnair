import type { Section } from "@/types/questionnaire";
import { isTrue, list, opts, single, text, yesNo } from "../helpers";

export const EVENTS: Section = {
  id: "industry_events",
  stepId: "industry",
  industryId: "events",
  title: "Events & Weddings",
  questions: [
    single("event_type", "What type of event?", opts([["wedding", "Wedding"], ["corporate", "Corporate event"], ["conference", "Conference or summit"], ["exhibition", "Exhibition or expo"], ["concert", "Concert or show"], ["birthday", "Birthday or celebration"], ["planner", "I am an event planning business"], ["other", "Other"]]), { required: true }),
    text("event_name", "Event name", { placeholder: "e.g. Ananya & Rahul, TechSummit 2026" }),
    text("event_dates", "Event dates", { placeholder: "e.g. 14 to 15 February 2026" }),
    yesNo("event_schedule", "Show an event schedule or programme?", { required: true }),
    yesNo("event_registration", "Do guests need to register?", { required: true }),
    yesNo("rsvp", "Do you need RSVP responses?", { required: true }),
    yesNo("ticketing", "Will you sell tickets on the website?", { required: true }),
    list("ticket_types", "Ticket types", { visibleWhen: isTrue("ticketing"), requiredWhen: isTrue("ticketing"), placeholder: "e.g. Early bird, Regular, VIP" }),
    yesNo("event_gallery", "Show a photo or video gallery?"),
    yesNo("venue_details", "Show venue details with a map?"),
  ],
};
