"use client";

import React, { useState, useEffect, JSX } from "react";
import SemesterRow from "./SemesterRow";
import SearchModal from "./SearchModal";
import ModuleDetailModal from "./ModuleDetailModal";
import moduleData from "../data/master.json";
import styles from "./GridView.module.css";

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

export default function GridView(): JSX.Element {
    const [semesters, setSemesters] = useState<Semester[]>(
        Array.from({ length: 4 }, (_, i) => ({ id: i + 1, modules: [] }))
    );

    const [moduleList, setModuleList] = useState<Module[]>([]);
    const [showModalSemester, setshowModalSemester] = useState<number | null>(null);
    const [detailModule, setDetailModule] = useState<Module | null>(null);
    const [startSemester, setStartSemester] = useState<"winter" | "summer">("winter");

    // turnus mapping
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

    // load json
    useEffect(() => {
        const mods = moduleData.map((mod: any) => ({
            id: mod.id,
            name: mod.name,
            credits: mod.credits,
            partOf: mod.partOf || [],
            language: mod.language,
            turnus: mapTurnus(mod.turnus),
            description: mod.description,
            responsible: mod.responsible,
        }));
        setModuleList(mods);
    }, []);

    // helper: get semester type
    const semesterType = (semesterId: number): "winter" | "summer" => {
        if (startSemester === "winter") {
            return semesterId % 2 === 1 ? "winter" : "summer";
        } else {
            return semesterId % 2 === 1 ? "summer" : "winter";
        }
    };

    // warnings
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

    const updateSemesterModules = (semesterId: number, modules: Module[]) => {
        setSemesters((prev) =>
            prev.map((s) => (s.id === semesterId ? { ...s, modules } : s))
        );
    };

    const moveModuleBetweenSemesters = (fromSemesterId: number, toSemesterId: number, module: Module) => {
        const warning = getModuleWarning(module, toSemesterId);
        const updatedMod = { ...module, warning };

        setSemesters((prev) =>
            prev.map((semester) => {
                if (semester.id === fromSemesterId) {
                    return { ...semester, modules: semester.modules.filter((m) => m.id !== module.id) };
                } else if (semester.id === toSemesterId) {
                    return { ...semester, modules: [...semester.modules, updatedMod] };
                } else {
                    return semester;
                }
            })
        );
    };

    const handleAddModules = (semesterId: number, mods: Module[]) => {
        const withWarnings = mods.map((m) => ({
            ...m,
            warning: getModuleWarning(m, semesterId),
        }));

        const semesterModules = semesters.find((r) => r.id === semesterId)?.modules || [];
        updateSemesterModules(semesterId, [...semesterModules, ...withWarnings]);
    };

    return (
        <main className={styles.main}>
            <div className={styles.container}>
                <header className={styles.header}>
                    <h1 className={styles.title}>Study Plan — Drag & Drop Modules with Credits</h1>
                    <p className={styles.subtitle}>
                        Choose modules from the JSON file and assign them to semesters.
                    </p>

                    <div className={styles.startSemesterContainer}>
                        <label htmlFor="startSemester">Start semester:</label>
                        <select
                            id="startSemester"
                            value={startSemester}
                            onChange={(e) =>
                                setStartSemester(e.target.value as "winter" | "summer")
                            }
                        >
                            <option value="winter">Winter semester</option>
                            <option value="summer">Summer semester</option>
                        </select>
                    </div>
                </header>

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
                    <ModuleDetailModal
                        module={detailModule}
                        close={() => setDetailModule(null)}
                    />
                )}
            </div>
        </main>
    );
}
