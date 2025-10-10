import { useState } from "react";
import { Semester } from "@/types/semester";
import { Module } from "@/types/module";
import { Affiliation, Turnus } from "@/utils/enums";

export function useSemesters() {
    const [semesters, setSemesters] = useState<Semester[]>(
        Array.from({ length: 4 }, (_, i) => ({ id: i + 1, modules: [] }))
    );

    const [startSemester, setStartSemester] = useState<"winter" | "summer">("winter");

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
        setSemesters(prev =>
            prev.map(s =>
                s.id === semesterId
                    ? { ...s, modules: modules.map(m => ({ ...m, warning: getModuleWarning(m, semesterId) })) }
                    : s
            )
        );
    };

    const moveModuleBetweenSemesters = (fromSemesterId: number, toSemesterId: number, module: Module) => {
        const warning = getModuleWarning(module, toSemesterId);
        const updatedMod = { ...module, warning };

        setSemesters(prev =>
            prev.map(semester => {
                if (semester.id === fromSemesterId) {
                    return { ...semester, modules: semester.modules.filter(m => m.id !== module.id) };
                } else if (semester.id === toSemesterId) {
                    return { ...semester, modules: [...semester.modules, updatedMod] };
                } else {
                    return semester;
                }
            })
        );
    };

    const handleAddModules = (semesterId: number, mods: Module[]) => {
        setSemesters(prev =>
            prev.map(s => {
                if (s.id !== semesterId) return s;

                const withWarnings = mods.map(m => ({
                    ...m,
                    warning: getModuleWarning(m, semesterId),
                }));
                return {
                    ...s,
                    modules: [...s.modules, ...withWarnings],
                };
            })
        );
    };

    const handleRemoveModule = (semester: Semester, modId: string) => {
        setSemesters(prev =>
            prev.map(s =>
                s.id === semester.id
                    ? { ...s, modules: s.modules.filter(m => m.id !== modId) }
                    : s
            )
        );
    };

    return {
        semesters,
        setSemesters,
        startSemester,
        setStartSemester,
        semesterType,
        getModuleWarning,
        updateSemesterModules,
        moveModuleBetweenSemesters,
        handleAddModules,
        handleRemoveModule,
    };
}
