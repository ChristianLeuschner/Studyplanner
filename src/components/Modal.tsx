"use client";

import React, { useState, useMemo } from "react";
import { X } from "lucide-react";
import { Module } from './GridView';
import styles from './Modal.module.css';

interface ModuleModalProps {
    modules: Module[];
    row: { id: number; modules: Module[] };
    closeModal: () => void;
    addModule: (mod: Module) => void;
}

export default function ModuleModal({ modules, row, closeModal, addModule }: ModuleModalProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

    const categories = useMemo(() => {
        const allCategories = modules.flatMap(m => m.partOf);
        return Array.from(new Set(allCategories));
    }, [modules]);

    const toggleCategory = (cat: string) => {
        setSelectedCategories(prev =>
            prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
        );
    };

    const filteredModules = modules.filter(mod => {
        const matchesSearch = mod.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategories.length === 0 || mod.partOf.some(p => selectedCategories.includes(p));
        return matchesSearch && matchesCategory;
    });

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <h2>Module auswählen — {row.id}. Semester</h2>
                    <button onClick={closeModal} className={styles.closeBtn}><X size={20} /></button>
                </div>

                <div className={styles.body}>
                    <div className={styles.left}>
                        <input
                            type="text"
                            placeholder="Suche..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={styles.searchInput}
                        />
                        <div className={styles.list}>
                            {filteredModules.map(mod => (
                                <div key={mod.id} className={styles.item} onClick={() => addModule(mod)}>
                                    {mod.name} ({mod.credits} CP)
                                </div>
                            ))}
                            {filteredModules.length === 0 && <div className={styles.noResults}>Keine Treffer</div>}
                        </div>
                    </div>

                    <div className={styles.right}>
                        <h3>Kategorien</h3>
                        <div className={styles.categoryList}>
                            {categories.map(cat => (
                                <label key={cat} className={styles.checkboxLabel}>
                                    <input
                                        type="checkbox"
                                        checked={selectedCategories.includes(cat)}
                                        onChange={() => toggleCategory(cat)}
                                    />
                                    {cat}
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
