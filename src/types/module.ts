import { Turnus } from "@/utils/enums";

export interface Module {
    id: string;
    name: string;
    credits: number;
    partOf: string[];
    language?: string;
    turnus: Turnus;
    description?: string;
    responsible?: string;
    warning?: "invalidSemester" | "unknown";
    //TODO: add optional role (elective, major, (specialization), master, others) with enum, when added to plan -> compute role
}