import type { Section } from "@/types/questionnaire";
import { isTrue, list, multi, opts, single, yesNo } from "../helpers";

export const EDUCATION: Section = {
  id: "industry_education",
  stepId: "industry",
  industryId: "education",
  title: "Education & Coaching",
  questions: [
    single("institute_type", "What kind of institution?", opts([["coaching", "Coaching centre"], ["school", "School"], ["college", "College or university"], ["online", "Online academy"], ["tutor", "Individual tutor or trainer"], ["other", "Other"]]), { required: true }),
    list("courses", "Courses or programmes to show", { required: true, placeholder: "e.g. JEE Foundation, Spoken English, Data Science" }),
    list("subjects", "Subjects covered", { placeholder: "e.g. Mathematics, Physics" }),
    multi("course_details", "What should each course page include?", opts([["syllabus", "Syllabus"], ["duration", "Duration"], ["schedule", "Schedule"], ["fees_info", "Fee information"], ["eligibility", "Eligibility"]]), { display: "checkboxes" }),
    yesNo("faculty_profiles", "Show faculty profiles?", { required: true }),
    yesNo("batches", "Show batches and schedules?", { required: true }),
    yesNo("admission_enquiry", "Do you need an admission enquiry form?", { required: true }),
    yesNo("online_learning", "Will students learn online through the website?", { required: true }),
    multi("learning_content", "What online learning content?", opts([["videos", "Recorded videos"], ["live", "Live classes"], ["notes", "Notes and downloads"], ["quizzes", "Quizzes and tests"]]), { display: "checkboxes", visibleWhen: isTrue("online_learning"), requiredWhen: isTrue("online_learning") }),
    yesNo("student_login", "Do students need a login?", { visibleWhen: isTrue("online_learning") }),
    yesNo("certificates", "Do you issue certificates on completion?"),
  ],
};
