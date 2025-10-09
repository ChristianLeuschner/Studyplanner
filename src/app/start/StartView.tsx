"use client";

import React, { useState, useEffect, JSX } from "react";
import SemesterRow from "./components/SemesterRow";
import InputView from "./components/InputView";
import SearchModal from "./components/SearchModal";
import ModuleDetailModal from "./components/ModuleDetailModal";
import moduleData from "../../data/master.json";
import styles from "./styles/StartView.module.css";

export enum Turnus {
    Every = "every",
    Winter = "winter",
    Summer = "summer",
    Unknown = "unknown",
}

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
}

export interface Semester {
    id: number;
    modules: Module[];
}

export default function StartView(): JSX.Element {
    const [semesters, setSemesters] = useState<Semester[]>(
        Array.from({ length: 4 }, (_, i) => ({ id: i + 1, modules: [] }))
    );

    const [moduleList, setModuleList] = useState<Module[]>([]);
    const [showModalSemester, setshowModalSemester] = useState<number | null>(null);
    const [detailModule, setDetailModule] = useState<Module | null>(null);
    const [startSemester, setStartSemester] = useState<"winter" | "summer">("winter");

    const [focus, setFocus] = useState<{
        schwerpunkte: string | null;
        vertiefungsfach1: string | null;
        vertiefungsfach2: string | null;
        ergaenzungsfach: string | null;
    }>({
        schwerpunkte: null,
        vertiefungsfach1: null,
        vertiefungsfach2: null,
        ergaenzungsfach: null,
    });

    const [ergaenzungsfachCredits, setErgaenzungsfachCredits] = useState(0);

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
        var partOfList: string[] = [];
        mod.partOf?.forEach((p: string) => {
            if (p.startsWith("Vertiefungsfach:")) {
                let name = p.replace("Vertiefungsfach:", "").trim();
                name = name.replace(/\(.*\)/, "").trim();
                partOfList.push(name);
            }
            if (p.startsWith("Ergänzungsfach:")) {
                let name = p.replace("Ergänzungsfach:", "").trim();
                name = name.replace(/\(.*\)/, "").trim();
                partOfList.push(name);
            }
        });
        return partOfList;
    }

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

    const semesterType = (semesterId: number): "winter" | "summer" => {
        if (startSemester === "winter") {
            return semesterId % 2 === 1 ? "winter" : "summer";
        } else {
            return semesterId % 2 === 1 ? "summer" : "winter";
        }
    };

    const getModuleWarning = (mod: Module, semesterId: number): Module["warning"] | undefined => {
        const semType = semesterType(semesterId);
        if (mod.turnus === Turnus.Every) return undefined;
        if (mod.turnus === Turnus.Unknown) return "unknown";
        if (
            (mod.turnus === Turnus.Winter && semType !== "winter") ||
            (mod.turnus === Turnus.Summer && semType !== "summer")
        ) {
            return "invalidSemester";
        }
        return undefined;
    };

    const recalculateErgaenzungsfachCredits = (
        updatedSemesters: Semester[],
        currentErgaenzungsfach: string | null
    ) => {
        if (!currentErgaenzungsfach) return 0;
        return updatedSemesters
            .flatMap(s => s.modules)
            .filter(mod =>
                mod.partOf.some(p =>
                    p === currentErgaenzungsfach
                )
            )
            .reduce((sum, m) => sum + m.credits, 0);
    };

    const updateSemesterModules = (semesterId: number, modules: Module[]) => {
        const updated = semesters.map((s) =>
            s.id === semesterId ? { ...s, modules: modules.map(m => ({ ...m, warning: getModuleWarning(m, semesterId) })) } : s
        );
        setSemesters(updated);
    };

    const moveModuleBetweenSemesters = (fromSemesterId: number, toSemesterId: number, module: Module) => {
        const warning = getModuleWarning(module, toSemesterId);
        const updatedMod = { ...module, warning };
        const updated = semesters.map((semester) => {
            if (semester.id === fromSemesterId) {
                return { ...semester, modules: semester.modules.filter((m) => m.id !== module.id) };
            } else if (semester.id === toSemesterId) {
                return { ...semester, modules: [...semester.modules, updatedMod] };
            } else {
                return semester;
            }
        });
        setSemesters(updated);
    };

    const handleAddModules = (semesterId: number, mods: Module[]) => {
        const withWarnings = mods.map((m) => ({
            ...m,
            warning: getModuleWarning(m, semesterId),
        }));
        const semesterModules = semesters.find((r) => r.id === semesterId)?.modules || [];
        const updated = semesters.map(s =>
            s.id === semesterId ? { ...s, modules: [...semesterModules, ...withWarnings] } : s
        );
        setSemesters(updated);
    };

    useEffect(() => {
        setErgaenzungsfachCredits(recalculateErgaenzungsfachCredits(semesters, focus.ergaenzungsfach));
    }, [focus.ergaenzungsfach, semesters]);

    return (
        <main className={styles.main}>
            <div className={styles.container}>
                <header className={styles.header}>
                    <h1 className={styles.title}>Study Plan – Drag & Drop Modules with Credits</h1>
                    <p className={styles.subtitle}>
                        Choose modules from the JSON file and assign them to semesters.
                    </p>
                </header>

                <InputView
                    startSemester={startSemester}
                    setStartSemester={setStartSemester}
                    focus={focus}
                    setFocus={setFocus}
                    ergaenzungsfachCredits={ergaenzungsfachCredits}
                />

                <section className={styles.section}>
                    {semesters.map((sem) => (
                        <SemesterRow
                            key={sem.id}
                            semester={sem}
                            showModal={() => setshowModalSemester(sem.id)}
                            moveModuleBetweenSemesters={moveModuleBetweenSemesters}
                            updateSemesterModules={updateSemesterModules}
                            onModuleClick={(mod) => setDetailModule(mod)}
                            semesterType={semesterType(sem.id)}
                        />
                    ))}
                </section>

                {showModalSemester !== null && (
                    <SearchModal
                        modules={moduleList}
                        semester={semesters.find((r) => r.id === showModalSemester)!}
                        closeModal={() => setshowModalSemester(null)}
                        addModules={(mods) => handleAddModules(showModalSemester, mods)}
                    />
                )}

                {detailModule && (
                    <ModuleDetailModal module={detailModule} close={() => setDetailModule(null)} />
                )}
            </div>
        </main>
    );
}
