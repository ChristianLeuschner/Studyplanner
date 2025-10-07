"use client";

import React from "react";
import { X, AlertTriangle } from "lucide-react";
import { Module } from "./GridView";
import styles from "./ModuleRow.module.css";

interface Row {
    id: number;
    modules: Module[];
}

interface ModuleRowProps {
    row: Row;
    showModal: () => void;
    moveModuleBetweenRows: (fromRowId: number, toRowId: number, module: Module) => void;
    updateRowModules: (rowId: number, modules: Module[]) => void;
    onModuleClick: (mod: Module) => void;
    semesterType: "winter" | "summer";
}

export default function ModuleRow({
    row,
    showModal,
    moveModuleBetweenRows,
    updateRowModules,
    onModuleClick,
    semesterType,
}: ModuleRowProps) {
    const totalCredits = row.modules.reduce((sum, m) => sum + m.credits, 0);

    const handleDragStart = (e: React.DragEvent, mod: Module) => {
        e.dataTransfer.setData("text/plain", JSON.stringify({ mod, fromRowId: row.id }));
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const data = JSON.parse(e.dataTransfer.getData("text/plain"));
        const { mod, fromRowId } = data;
        if (fromRowId !== row.id) {
            moveModuleBetweenRows(fromRowId, row.id, mod);
        }
    };

    const handleDragOver = (e: React.DragEvent) => e.preventDefault();

    const handleRemoveModule = (modId: string) => {
        const updated = row.modules.filter((m) => m.id !== modId);
        updateRowModules(row.id, updated);
    };

    const semesterLabel =
        semesterType === "winter" ? "Winter semester" : "Summer semester";

    return (
        <div className={styles.wrapper}>
            <div className={styles.semesterLabelBar}>{semesterLabel}</div>

            <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className={styles.root}
            >
                <div className={styles.header}>
                    <h2 className={styles.semester}>
                        {row.id}. Semester ({totalCredits} CP)
                    </h2>
                    <button onClick={showModal} className={styles.addBtn}>
                        + Modul hinzufügen
                    </button>
                </div>

                <div className={styles.grid}>
                    {row.modules.map((mod) => {
                        const isWarning = !!mod.warning;
                        const tooltip =
                            mod.warning === "invalidSemester"
                                ? "Dieses Modul wird nur im passenden Semester angeboten."
                                : mod.warning === "unknown"
                                    ? "Turnus des Moduls ist unbekannt."
                                    : undefined;

                        const iconColor =
                            mod.warning === "invalidSemester" ? "#dc2626" : "#f97316";

                        return (
                            <div
                                key={mod.id}
                                draggable
                                onDragStart={(e) => handleDragStart(e, mod)}
                                onClick={() => onModuleClick(mod)}
                                className={styles.module}
                            >
                                <div className={styles.moduleContent}>
                                    <div>{mod.name}</div>
                                    <div className={styles.credits}>{mod.credits} CP</div>
                                </div>

                                {isWarning && (
                                    <div
                                        className={styles.warningIcon}
                                        title={tooltip}
                                        style={{ color: iconColor }}
                                    >
                                        <AlertTriangle size={16} />
                                    </div>
                                )}

                                <div
                                    className={styles.removeBtn}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleRemoveModule(mod.id);
                                    }}
                                >
                                    <X size={14} />
                                </div>
                            </div>
                        );
                    })}
                </div>

                {row.modules.length === 0 && (
                    <p className={styles.empty}>Noch keine Module hinzugefügt.</p>
                )}
            </div>
        </div>
    );
}
