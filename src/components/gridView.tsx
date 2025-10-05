"use client";

import React, { useState, useEffect } from "react";
import ModuleRow from './moduleRow';
import moduleData from '../data/master.json';

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
        <main style={{ minHeight: '100vh', backgroundColor: '#f9fafb', padding: '2rem', color: '#111' }}>
            <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
                <header style={{ marginBottom: '1.5rem' }}>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Studyplan — Drag & Drop Module mit Credits</h1>
                    <p style={{ fontSize: '0.875rem', color: '#555' }}>Wähle Module aus der JSON-Datei, um sie einer Zeile hinzuzufügen.</p>
                </header>

                <section style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
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
