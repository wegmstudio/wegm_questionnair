import type { Section } from "@/types/questionnaire";
import { isTrue, list, opts, single, yesNo } from "../helpers";

export const GYM: Section = {
  id: "industry_gym",
  stepId: "industry",
  industryId: "gym",
  title: "Gym & Fitness",
  questions: [
    single("gym_type", "What kind of fitness business?", opts([["gym", "Gym"], ["yoga", "Yoga or pilates studio"], ["crossfit", "CrossFit or functional training"], ["personal", "Personal training"], ["martial_arts", "Martial arts or dance"], ["other", "Other"]]), { required: true }),
    list("membership_plans", "Membership plans to show", { required: true, placeholder: "e.g. Monthly, Quarterly, Annual, Couples" }),
    yesNo("trainer_profiles", "Show trainer profiles?", { required: true }),
    yesNo("workout_programmes", "Show workout programmes or services?", { required: true }),
    yesNo("class_schedules", "Show class schedules or timetables?", { required: true }),
    single("schedule_updates", "How often does the schedule change?", opts([["weekly", "Weekly"], ["monthly", "Monthly"], ["rarely", "Rarely"]]), { visibleWhen: isTrue("class_schedules") }),
    yesNo("membership_enquiry", "Do you need a membership enquiry form?"),
    yesNo("online_registration", "Should people be able to sign up for a membership online?", { required: true }),
    yesNo("online_membership_payment", "Should they pay online when signing up?", { visibleWhen: isTrue("online_registration"), requiredWhen: isTrue("online_registration") }),
    yesNo("gym_gallery", "Do you want a photo gallery of the facility?"),
  ],
};
