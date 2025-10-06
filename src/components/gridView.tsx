"use client";

import React, { useState, useEffect } from "react";
import ModuleRow from './ModuleRow';
import ModuleModal from './Modal';
import ModuleDetailModal from './ModuleDetailModal';
import moduleData from '../data/master.json';
import styles from './GridView.module.css';

export interface Module {
    id: string;
    name: string;
    credits: number;
    partOf: string[];
    language?: string;
    turnus?: string;
    description?: string;
    responsible?: string;
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
    const [detailModule, setDetailModule] = useState<Module | null>(null);

    useEffect(() => {
        const mods = moduleData.map((mod: any) => ({
            id: mod.id,
            name: mod.name,
            credits: mod.credits,
            partOf: mod.partOf || [],
            language: mod.language,
            turnus: mod.turnus,
            description: mod.description,
            responsible: mod.responsible,
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
                            updateRowModules={updateRowModules}
                            onModuleClick={(mod) => setDetailModule(mod)}
                        />
                    ))}
                </section>

                {showModalRow !== null && (
                    <ModuleModal
                        modules={moduleList}
                        row={rows.find(r => r.id === showModalRow)!}
                        closeModal={() => setShowModalRow(null)}
                        addModules={(mods) => {
                            const rowModules = rows.find(r => r.id === showModalRow)?.modules || [];
                            updateRowModules(showModalRow, [...rowModules, ...mods]);
                        }}
                    />
                )}

                {detailModule && (
                    <ModuleDetailModal
                        module={detailModule}
                        close={() => setDetailModule(null)}
                    />
                )}
            </div>
        </main>
    );
}
