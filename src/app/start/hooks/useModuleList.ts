import { useState, useEffect } from "react";
import moduleData from "../../../data/master.json";
import { Module } from "@/types/module";
import { Turnus } from "@/utils/enums";

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
                let name = p.split(":")[1].trim().replace(/\(.*\)/, "").trim();
                partOfList.push(name);
            }
        });
        return partOfList;
    };

    useEffect(() => {
        const mods = moduleData.map((mod: any) => ({
            id: mod.id,
            name: mod.name,
            credits: mod.credits,
            partOf: optimizeCategories(mod) || [],
            language: mod.language,
            turnus: mapTurnus(mod.turnus),
            description: mod.description,
            responsible: mod.responsible,
        }));
        setModuleList(mods);
    }, []);

    return { moduleList };
}
