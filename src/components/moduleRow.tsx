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
    filteredModules: Module[];
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    showDropdownRow: number | null;
    setShowDropdownRow: (id: number | null) => void;
    updateRowModules: (rowId: number, modules: Module[]) => void;
    moveModuleBetweenRows: (fromRowId: number, toRowId: number, module: Module) => void;
}

export default function ModuleRow({ row, filteredModules, searchTerm, setSearchTerm, showDropdownRow, setShowDropdownRow, updateRowModules, moveModuleBetweenRows }: ModuleRowProps) {
    const totalCredits = row.modules.reduce((sum, m) => sum + m.Credits, 0);

    const handleAddModule = (mod: Module) => {
        updateRowModules(row.id, [...row.modules, mod]);
        setShowDropdownRow(null);
        setSearchTerm("");
    };

    const handleRemoveModule = (modName: string) => {
        updateRowModules(row.id, row.modules.filter(m => m.Name !== modName));
    };

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

    return (
        <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className={styles.root}
        >
            <div className={styles.header}>
                <h2 className={styles.semester}>{row.id}. Semester ({totalCredits} CP)</h2>
                <div style={{ position: 'relative' }}>
                    <button onClick={() => setShowDropdownRow(showDropdownRow === row.id ? null : row.id)}
                        className={styles.addBtn}>
                        <Plus size={16} /> Modul hinzufügen
                    </button>
                    {showDropdownRow === row.id && (
                        <div className={styles.dropdown}>
                            <input type="text" placeholder="Suche..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                                className={styles.searchInput} />
                            <div className={styles.dropdownList}>
                                {filteredModules.map((mod, idx) => (
                                    <div key={idx} onClick={() => handleAddModule(mod)}
                                        className={styles.dropdownItem}>
                                        {mod.Name} ({mod.Credits} CP)
                                    </div>
                                ))}
                                {filteredModules.length === 0 && <div className={styles.noResults}>Keine Treffer</div>}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className={styles.grid}>
                {row.modules.map((mod, idx) => (
                    <div key={idx}
                        draggable
                        onDragStart={(e) => handleDragStart(e, mod)}
                        className={styles.module}>
                        <div>{mod.Name}</div>
                        <div className={styles.credits}>{mod.Credits} CP</div>
                        <div onClick={() => handleRemoveModule(mod.Name)}
                            className={styles.removeBtn}>
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
