"use client";

import React from "react";
import { X, AlertTriangle } from "lucide-react";
import { Module } from "./GridView";
import styles from "./ModuleCard.module.css";

interface ModuleCardProps {
    mod: Module;
    onClick: (mod: Module) => void;
    onRemove: (modId: string) => void;
    onDragStart: (e: React.DragEvent, mod: Module) => void;
}

export default function ModuleCard({ mod, onClick, onRemove, onDragStart }: ModuleCardProps) {
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
                    onRemove(mod.id);
                }}
            >
                <X size={14} />
            </div>
        </div>
    );
}
