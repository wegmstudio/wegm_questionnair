import type { Section } from "@/types/questionnaire";
import { RETAIL } from "./retail";
import { RESTAURANT } from "./restaurant";
import { GYM } from "./gym";
import { REAL_ESTATE } from "./real-estate";
import { HEALTHCARE } from "./healthcare";
import { EDUCATION } from "./education";
import { TRAVEL } from "./travel";
import { PROFESSIONAL } from "./professional";
import { EVENTS } from "./events";
import { BEAUTY } from "./beauty";
import { TECHNOLOGY } from "./technology";
import { OTHER } from "./other";

export const INDUSTRY_SECTIONS: Section[] = [RETAIL, RESTAURANT, GYM, REAL_ESTATE, HEALTHCARE, EDUCATION, TRAVEL, PROFESSIONAL, EVENTS, BEAUTY, TECHNOLOGY, OTHER];
