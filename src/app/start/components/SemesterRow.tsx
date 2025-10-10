"use client";

import React from "react";
import ModuleCard from "./ModuleCard";
import styles from "../styles/SemesterRow.module.css";
import { Module } from "@/types/module";
import { Semester } from "@/types/semester";

interface SemesterRowProps {
    semester: Semester;
    showModal: () => void;
    moveModuleBetweenSemesters: (fromSemesterId: number, toSemesterId: number, module: Module) => void;
    handleRemoveModule: (semester: Semester, moduleId: string) => void;
    onModuleClick: (mod: Module) => void;
    semesterType: "winter" | "summer";
}

export default function SemesterRow({
    semester,
    showModal,
    moveModuleBetweenSemesters,
    handleRemoveModule,
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



    const semesterLabel = semesterType === "winter" ? "Winter semester" : "Summer semester";

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
                            mod={mod}
                            handleRemoveModule={handleRemoveModule}
                            onClick={onModuleClick}
                            semester={semester}
                            onDragStart={handleDragStart}
                        />
                    ))}

                    {/* Add module button in the center of the grid */}
                    <div className={styles.addModuleBtnContainer}>
                        <button onClick={showModal} className={styles.addModuleBtn}>
                            + Add module
                        </button>
                    </div>


                </div>

                {semester.modules.length === 0 && (
                    <p className={styles.empty}>No modules added yet.</p>
                )}
            </div>
        </div>
    );
}
