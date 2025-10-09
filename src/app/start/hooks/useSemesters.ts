import { useState } from "react";
import { Semester } from "@/types/semester";
import { Module } from "@/types/module";
import { Turnus } from "@/utils/enums";

interface UseSemestersProps {
    startSemester: "winter" | "summer";
}

export function useSemesters({ startSemester }: UseSemestersProps) {
    const [semesters, setSemesters] = useState<Semester[]>(
        Array.from({ length: 4 }, (_, i) => ({ id: i + 1, modules: [] }))
    );

    const semesterType = (semesterId: number): "winter" | "summer" => {
        return startSemester === "winter"
            ? semesterId % 2 === 1 ? "winter" : "summer"
            : semesterId % 2 === 1 ? "summer" : "winter";
    };

    const getModuleWarning = (mod: Module, semesterId: number): Module["warning"] | undefined => {
        const semType = semesterType(semesterId);
        if (mod.turnus === Turnus.Every) return undefined;
        if (mod.turnus === Turnus.Unknown) return "unknown";
        if ((mod.turnus === Turnus.Winter && semType !== "winter") ||
            (mod.turnus === Turnus.Summer && semType !== "summer")) {
            return "invalidSemester";
        }
        return undefined;
    };

    const updateSemesterModules = (semesterId: number, modules: Module[]) => {
        const updated = semesters.map(s =>
            s.id === semesterId
                ? { ...s, modules: modules.map(m => ({ ...m, warning: getModuleWarning(m, semesterId) })) }
                : s
        );
        setSemesters(updated);
    };

    const moveModuleBetweenSemesters = (fromSemesterId: number, toSemesterId: number, module: Module) => {
        const warning = getModuleWarning(module, toSemesterId);
        const updatedMod = { ...module, warning };
        const updated = semesters.map(semester => {
            if (semester.id === fromSemesterId) {
                return { ...semester, modules: semester.modules.filter(m => m.id !== module.id) };
            } else if (semester.id === toSemesterId) {
                return { ...semester, modules: [...semester.modules, updatedMod] };
            } else {
                return semester;
            }
        });
        setSemesters(updated);
    };

    const handleAddModules = (semesterId: number, mods: Module[]) => {
        const withWarnings = mods.map(m => ({ ...m, warning: getModuleWarning(m, semesterId) }));
        const semesterModules = semesters.find(s => s.id === semesterId)?.modules || [];
        const updated = semesters.map(s =>
            s.id === semesterId ? { ...s, modules: [...semesterModules, ...withWarnings] } : s
        );
        setSemesters(updated);
    };

    return {
        semesters,
        semesterType,
        getModuleWarning,
        updateSemesterModules,
        moveModuleBetweenSemesters,
        handleAddModules,
    };
}
