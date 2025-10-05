"use client";

import React from "react";
import { Plus, X } from "lucide-react";
import { Module } from './GridView';

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
            style={{ backgroundColor: '#fff', borderRadius: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '1rem', border: '1px solid #ddd', minHeight: '6rem' }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <h2 style={{ fontWeight: 600 }}>{row.id}. Semester ({totalCredits} CP)</h2>
                <div style={{ position: 'relative' }}>
                    <button onClick={() => setShowDropdownRow(showDropdownRow === row.id ? null : row.id)}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.375rem 0.75rem', borderRadius: '0.5rem', backgroundColor: '#eee', cursor: 'pointer' }}>
                        <Plus size={16} /> Modul hinzufügen
                    </button>
                    {showDropdownRow === row.id && (
                        <div style={{ position: 'absolute', top: '2.5rem', left: 0, backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '0.5rem', width: '15rem', zIndex: 10, padding: '0.5rem' }}>
                            <input type="text" placeholder="Suche..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                                style={{ width: '100%', padding: '0.25rem 0.5rem', marginBottom: '0.5rem', border: '1px solid #ddd', borderRadius: '0.25rem' }} />
                            <div style={{ maxHeight: '10rem', overflowY: 'auto' }}>
                                {filteredModules.map((mod, idx) => (
                                    <div key={idx} onClick={() => handleAddModule(mod)}
                                        style={{ padding: '0.25rem 0.5rem', cursor: 'pointer', borderRadius: '0.25rem', hover: { backgroundColor: '#eee' } }}>
                                        {mod.Name} ({mod.Credits} CP)
                                    </div>
                                ))}
                                {filteredModules.length === 0 && <div style={{ color: '#888', fontSize: '0.875rem' }}>Keine Treffer</div>}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '0.75rem' }}>
                {row.modules.map((mod, idx) => (
                    <div key={idx}
                        draggable
                        onDragStart={(e) => handleDragStart(e, mod)}
                        style={{ position: 'relative', backgroundColor: '#eee', borderRadius: '0.5rem', padding: '0.75rem', textAlign: 'center', fontSize: '0.875rem', color: '#111', border: '1px solid #ccc', cursor: 'grab' }}>
                        <div>{mod.Name}</div>
                        <div style={{ fontSize: '0.75rem', color: '#555' }}>{mod.Credits} CP</div>
                        <div onClick={() => handleRemoveModule(mod.Name)}
                            style={{ position: 'absolute', top: '0.25rem', right: '0.25rem', cursor: 'pointer', color: 'red' }}>
                            <X size={14} />
                        </div>
                    </div>
                ))}
            </div>

            {row.modules.length === 0 && (
                <p style={{ fontSize: '0.75rem', color: '#888', fontStyle: 'italic', marginTop: '0.5rem' }}>Noch keine Module hinzugefügt.</p>
            )}
        </div>
    );
}
