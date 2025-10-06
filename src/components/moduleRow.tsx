"use client";

import React from "react";
import { Plus, X } from "lucide-react";
import { Module } from './GridView';
import styles from './ModuleRow.module.css';

interface Row {
    id: number;
    modules: Module[];
}

interface ModuleRowProps {
    row: Row;
    showModal: () => void;
    moveModuleBetweenRows: (fromRowId: number, toRowId: number, module: Module) => void;
    updateRowModules?: (rowId: number, modules: Module[]) => void; // optional, falls wir direkt State von GridView nutzen
}

export default function ModuleRow({ row, showModal, moveModuleBetweenRows, updateRowModules }: ModuleRowProps) {
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
        if (updateRowModules) {
            const updated = row.modules.filter(m => m.id !== modId);
            updateRowModules(row.id, updated);
        }
    };

    return (
        <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className={styles.root}
        >
            <div className={styles.header}>
                <h2 className={styles.semester}>{row.id}. Semester ({totalCredits} CP)</h2>
                <button onClick={showModal} className={styles.addBtn}>
                    <Plus size={16} /> Modul hinzufügen
                </button>
            </div>

            <div className={styles.grid}>
                {row.modules.map((mod) => (
                    <div key={mod.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, mod)}
                        className={styles.module}>
                        <div>{mod.name}</div>
                        <div className={styles.credits}>{mod.credits} CP</div>
                        <div className={styles.removeBtn} onClick={() => handleRemoveModule(mod.id)}>
                            <X size={14} />
                        </div>
                    </div>
                ))}
            </div>

            {row.modules.length === 0 && (
                <p className={styles.empty}>Noch keine Module hinzugefügt.</p>
            )}
        </div>
    );
}
