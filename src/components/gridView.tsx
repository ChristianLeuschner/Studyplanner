"use client";

import React, { useState, useEffect } from "react";
import ModuleRow from './moduleRow';
import moduleData from '../data/master.json';
import styles from './GridView.module.css';

export interface Module {
    Name: string;
    Credits: number;
}

interface Row {
    id: number;
    modules: Module[];
}

export default function GridView(): JSX.Element {
    const [rows, setRows] = useState<Row[]>(
        Array.from({ length: 4 }, (_, i) => ({ id: i + 1, modules: [] }))
    );

    const [searchTerm, setSearchTerm] = useState("");
    const [showDropdownRow, setShowDropdownRow] = useState<number | null>(null);
    const [moduleList, setModuleList] = useState<Module[]>([]);

    useEffect(() => {
        const names = moduleData.map((mod: any) => ({ Name: mod.Name, Credits: mod.Credits }));
        setModuleList(names);
    }, []);

    const filteredModules = moduleList.filter((mod) =>
        mod.Name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const updateRowModules = (rowId: number, modules: Module[]) => {
        setRows(prev => prev.map(r => r.id === rowId ? { ...r, modules } : r));
    };

    const moveModuleBetweenRows = (fromRowId: number, toRowId: number, module: Module) => {
        setRows(prev => prev.map(row => {
            if (row.id === fromRowId) {
                return { ...row, modules: row.modules.filter(m => m.Name !== module.Name) };
            } else if (row.id === toRowId) {
                return { ...row, modules: [...row.modules, module] };
            } else {
                return row;
            }
        }));
    };

    return (
        <main className={styles.main}>
            <div className={styles.container}>
                <header className={styles.header}>
                    <h1 className={styles.title}>Studyplan — Drag & Drop Module mit Credits</h1>
                    <p className={styles.subtitle}>Wähle Module aus der JSON-Datei, um sie einer Zeile hinzuzufügen.</p>
                </header>

                <section className={styles.section}>
                    {rows.map(row => (
                        <ModuleRow
                            key={row.id}
                            row={row}
                            filteredModules={filteredModules}
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                            showDropdownRow={showDropdownRow}
                            setShowDropdownRow={setShowDropdownRow}
                            updateRowModules={updateRowModules}
                            moveModuleBetweenRows={moveModuleBetweenRows}
                        />
                    ))}
                </section>
            </div>
        </main>
    );
}
