import { useState, useEffect } from "react";
import moduleData from "../../../data/master_25.json";
import { Module } from "@/types/module";
import { ModuleType, Turnus } from "@/utils/enums";

export function useModuleList() {
    const [moduleList, setModuleList] = useState<Module[]>([]);

    const mapTurnus = (t: string): Turnus => {
        switch (t?.toLowerCase()) {
            case "ws":
                return Turnus.Winter;
            case "ss":
                return Turnus.Summer;
            case "jedes":
                return Turnus.Every;
            default:
                return Turnus.Unknown;
        }
    };

    const optimizeCategories = (mod: Module): string[] => {
        const partOfList: string[] = [];
        mod.partOf?.forEach((p: string) => {
            if (p.startsWith("Vertiefungsfach:") || p.startsWith("Ergänzungsfach:")) {
                const name = p.trim().replace(/\(.*\)/, "").trim();
                partOfList.push(name);
            }
        });
        return partOfList;
    };

    const mapType = (mod: Module): ModuleType => {
        const cleanName = mod.name.toLowerCase();
        if (cleanName.includes("seminar")) return ModuleType.Seminar; // Must be before praktikum because some have both in the name
        if (cleanName.includes("praktikum") || cleanName.includes("practical") || cleanName.includes("lab")) return ModuleType.Internship;
        return ModuleType.Other;
    }

    useEffect(() => {
        const mods = moduleData.map((mod: any) => ({
            id: mod.id.trim(),
            name: mod.name,
            credits: mod.credits,
            partOf: optimizeCategories(mod) || [],
            language: mod.language,
            turnus: mapTurnus(mod.turnus),
            description: mod.description,
            responsible: mod.responsible,
            type: mapType(mod),
        }));
        setModuleList(mods);
    }, []);

    return { moduleList };
}
