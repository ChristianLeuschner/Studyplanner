"use client";

import React, { useState, useEffect } from "react";
import ModuleRow from './ModuleRow';
import ModuleModal from './Modal';
import moduleData from '../data/master.json';
import styles from './GridView.module.css';

export interface Module {
    id: string;
    name: string;
    credits: number;
    partOf: string[];
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

    useEffect(() => {
        const mods = moduleData.map((mod: any) => ({
            id: mod.id,
            name: mod.name,
            credits: mod.credits,
            partOf: mod.partOf || []
        }));
        setModuleList(mods);
    }, []);

    const updateRowModules = (rowId: number, modules: Module[]) => {
        setRows(prev => prev.map(r => r.id === rowId ? { ...r, modules } : r));
    };

    const moveModuleBetweenRows = (fromRowId: number, toRowId: number, module: Module) => {
        setRows(prev => prev.map(row => {
            if (row.id === fromRowId) {
                return { ...row, modules: row.modules.filter(m => m.id !== module.id) };
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
                            showModal={() => setShowModalRow(row.id)}
                            moveModuleBetweenRows={moveModuleBetweenRows}
                            updateRowModules={updateRowModules} // ← unbedingt übergeben
                        />

                    ))}
                </section>

                {showModalRow !== null && (
                    <ModuleModal
                        modules={moduleList}
                        row={rows.find(r => r.id === showModalRow)!}
                        closeModal={() => setShowModalRow(null)}
                        addModule={(mod) => {
                            updateRowModules(showModalRow, [...rows.find(r => r.id === showModalRow)!.modules, mod]);
                        }}
                    />
                )}
            </div>
        </main>
    );
}
