import { Affiliation, Turnus } from "@/utils/enums";

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
    affiliation?: Affiliation;
}