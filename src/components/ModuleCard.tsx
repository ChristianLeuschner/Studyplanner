"use client";
import React from "react";
import { X, AlertTriangle } from "lucide-react";
import { Module } from "./GridView";
import styles from "./SemesterRow.module.css";

interface ModuleCardProps {
    module: Module;
    onClick: (mod: Module) => void;
    onRemove: (modId: string) => void;
    draggable?: boolean;
    onDragStart?: (e: React.DragEvent, mod: Module) => void;
}

export default function ModuleCard({
    module,
    onClick,
    onRemove,
    draggable,
    onDragStart,
}: ModuleCardProps) {
    const isWarning = !!module.warning;
    const tooltip =
        module.warning === "invalidSemester"
            ? "This module is only offered in a specific semester."
            : module.warning === "unknown"
                ? "Module schedule is unknown."
                : undefined;
    const iconColor = module.warning === "invalidSemester" ? "#dc2626" : "#f97316";

    return (
        <div
            key={module.id}
            draggable={draggable}
            onDragStart={(e) => onDragStart && onDragStart(e, module)}
            onClick={() => onClick(module)}
            className={styles.module}
        >
            <div className={styles.moduleContent}>
                <div>{module.name}</div>
                <div className={styles.credits}>{module.credits} CP</div>
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
                    onRemove(module.id);
                }}
            >
                <X size={14} />
            </div>
        </div>
    );
}
