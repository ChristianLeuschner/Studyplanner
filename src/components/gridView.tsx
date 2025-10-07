"use client";

import React, { useState, useEffect, JSX } from "react";
import ModuleRow from "./ModuleRow";
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

interface Row {
    id: number;
    modules: Module[];
}

export default function GridView(): JSX.Element {
    const [rows, setRows] = useState<Row[]>(
        Array.from({ length: 4 }, (_, i) => ({ id: i + 1, modules: [] }))
    );

    const [moduleList, setModuleList] = useState<Module[]>([]);
    const [showModalRow, setShowModalRow] = useState<number | null>(null);
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

    // helper: get semester type based on starting semester
    const semesterType = (rowId: number): "winter" | "summer" => {
        if (startSemester === "winter") {
            return rowId % 2 === 1 ? "winter" : "summer";
        } else {
            return rowId % 2 === 1 ? "summer" : "winter";
        }
    };

    // validate module for semester
    const getModuleWarning = (mod: Module, rowId: number): Module["warning"] | undefined => {
        const semType = semesterType(rowId);
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

    const updateRowModules = (rowId: number, modules: Module[]) => {
        setRows((prev) =>
            prev.map((r) => (r.id === rowId ? { ...r, modules } : r))
        );
    };

    const moveModuleBetweenRows = (fromRowId: number, toRowId: number, module: Module) => {
        const warning = getModuleWarning(module, toRowId);
        const updatedMod = { ...module, warning };

        setRows((prev) =>
            prev.map((row) => {
                if (row.id === fromRowId) {
                    return { ...row, modules: row.modules.filter((m) => m.id !== module.id) };
                } else if (row.id === toRowId) {
                    return { ...row, modules: [...row.modules, updatedMod] };
                } else {
                    return row;
                }
            })
        );
    };

    const handleAddModules = (rowId: number, mods: Module[]) => {
        const withWarnings = mods.map((m) => ({
            ...m,
            warning: getModuleWarning(m, rowId),
        }));

        const rowModules = rows.find((r) => r.id === rowId)?.modules || [];
        updateRowModules(rowId, [...rowModules, ...withWarnings]);
    };

    return (
        <main className={styles.main}>
            <div className={styles.container}>
                <header className={styles.header}>
                    <h1 className={styles.title}>Studyplan — Drag & Drop Module mit Credits</h1>
                    <p className={styles.subtitle}>
                        Wähle Module aus der JSON-Datei, um sie einer Zeile hinzuzufügen.
                    </p>

                    <div className={styles.startSemesterContainer}>
                        <label htmlFor="startSemester">Start:</label>
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
                    {rows.map((row) => (
                        <ModuleRow
                            key={row.id}
                            row={row}
                            showModal={() => setShowModalRow(row.id)}
                            moveModuleBetweenRows={moveModuleBetweenRows}
                            updateRowModules={updateRowModules}
                            onModuleClick={(mod) => setDetailModule(mod)}
                            semesterType={semesterType(row.id)}
                        />
                    ))}
                </section>

                {showModalRow !== null && (
                    <SearchModal
                        modules={moduleList}
                        row={rows.find((r) => r.id === showModalRow)!}
                        closeModal={() => setShowModalRow(null)}
                        addModules={(mods) => handleAddModules(showModalRow, mods)}
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
