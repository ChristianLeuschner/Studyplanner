"use client";

import React from "react";
import { Module, Semester } from "./GridView";
import ModuleCard from "./ModuleCard";
import styles from "./SemesterRow.module.css";

interface SemesterRowProps {
    semester: Semester;
    showModal: () => void;
    moveModuleBetweenSemesters: (fromSemesterId: number, toSemesterId: number, module: Module) => void;
    updateSemesterModules: (semesterId: number, modules: Module[]) => void;
    onModuleClick: (mod: Module) => void;
    semesterType: "winter" | "summer";
}

export default function SemesterRow({
    semester,
    showModal,
    moveModuleBetweenSemesters,
    updateSemesterModules,
    onModuleClick,
    semesterType,
}: SemesterRowProps) {
    const totalCredits = semester.modules.reduce((sum, m) => sum + m.credits, 0);

    const handleDragStart = (e: React.DragEvent, mod: Module) => {
        e.dataTransfer.setData("text/plain", JSON.stringify({ mod, fromSemesterId: semester.id }));
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const data = JSON.parse(e.dataTransfer.getData("text/plain"));
        const { mod, fromSemesterId } = data;
        if (fromSemesterId !== semester.id) {
            moveModuleBetweenSemesters(fromSemesterId, semester.id, mod);
        }
    };

    const handleDragOver = (e: React.DragEvent) => e.preventDefault();

    const handleRemoveModule = (modId: string) => {
        const updated = semester.modules.filter((m) => m.id !== modId);
        updateSemesterModules(semester.id, updated);
    };

    const semesterLabel =
        semesterType === "winter" ? "Winter semester" : "Summer semester";

    return (
        <div className={styles.wrapper}>
            <div className={styles.semesterLabelBar}>{semesterLabel}</div>

            <div onDrop={handleDrop} onDragOver={handleDragOver} className={styles.root}>
                <div className={styles.header}>
                    <h2 className={styles.semester}>
                        {semester.id}. Semester ({totalCredits} CP)
                    </h2>
                </div>

                <div className={styles.grid}>
                    {semester.modules.map((mod) => (
                        <ModuleCard
                            key={mod.id}
                            module={mod}
                            onClick={onModuleClick}
                            onRemove={handleRemoveModule}
                            draggable
                            onDragStart={handleDragStart}
                        />
                    ))}

                    {/* Add module button als letzte "Card" in der Mitte */}
                    <div
                        className={`${styles.module} ${styles.addModuleCard}`}
                        onClick={showModal}
                        style={{ cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 500, color: "#555", fontSize: "0.875rem" }}
                    >
                        + Add module
                    </div>
                </div>

                {semester.modules.length === 0 && (
                    <p className={styles.empty}>No modules added yet.</p>
                )}
            </div>
        </div>
    );
}
