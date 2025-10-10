"use client";

import React from "react";
import { X, AlertTriangle } from "lucide-react";
import styles from "../styles/ModuleCard.module.css";
import { Module } from "@/types/module";
import { useSemesters } from "../hooks/useSemesters";
import { Semester } from "@/types/semester";

interface ModuleCardProps {
    mod: Module;
    semester: Semester;
    handleRemoveModule: (semester: Semester, moduleId: string) => void;
    onClick: (mod: Module) => void;
    onDragStart: (e: React.DragEvent, mod: Module) => void;
}

export default function ModuleCard({ mod, semester, handleRemoveModule, onClick, onDragStart }: ModuleCardProps) {
    const isWarning = !!mod.warning;
    const tooltip =
        mod.warning === "invalidSemester"
            ? "This module is only offered in a specific semester."
            : mod.warning === "unknown"
                ? "Module schedule is unknown."
                : undefined;

    const iconColor = mod.warning === "invalidSemester" ? "#dc2626" : "#f97316";


    return (
        <div
            className={styles.module}
            draggable
            onDragStart={(e) => onDragStart(e, mod)}
            onClick={() => onClick(mod)}
        >
            <div className={styles.moduleContent}>
                <div>{mod.name}</div>
                <div className={styles.credits}>{mod.credits} CP</div>
            </div>

            {isWarning && (
                <div className={styles.warningIcon} title={tooltip} style={{ color: iconColor }}>
                    <AlertTriangle size={16} />
                </div>
            )}

            <div
                className={styles.removeBtn}
                onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveModule(semester, mod.id);
                }}
            >
                <X size={14} />
            </div>
        </div>
    );
}
