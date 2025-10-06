"use client";

import React, { useState, useMemo } from "react";
import { X } from "lucide-react";
import { Module } from "./GridView";
import styles from "./Modal.module.css";

interface ModuleModalProps {
    modules: Module[];
    row: { id: number; modules: Module[] };
    closeModal: () => void;
    addModules: (mods: Module[]) => void;
}

export default function ModuleModal({ modules, row, closeModal, addModules }: ModuleModalProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [checkedModules, setCheckedModules] = useState<Set<string>>(new Set());

    const categories = useMemo(() => {
        const allCategories = modules.flatMap((m) => m.partOf);
        return Array.from(new Set(allCategories)).sort((a, b) => a.localeCompare(b));
    }, [modules]);

    const toggleCategory = (cat: string) => {
        setSelectedCategories((prev) =>
            prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
        );
    };

    const toggleModuleCheck = (modId: string) => {
        setCheckedModules((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(modId)) {
                newSet.delete(modId);
            } else {
                newSet.add(modId);
            }
            return newSet;
        });
    };

    const filteredModules = modules.filter((mod) => {
        const matchesSearch = mod.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory =
            selectedCategories.length === 0 ||
            mod.partOf.some((p) => selectedCategories.includes(p));
        return matchesSearch && matchesCategory;
    });

    const handleAdd = () => {
        const modsToAdd = modules.filter((mod) => checkedModules.has(mod.id));
        addModules(modsToAdd);
        closeModal();
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <h2>Module auswählen — {row.id}. Semester</h2>
                    <button onClick={closeModal} className={styles.closeBtn}>
                        <X size={20} />
                    </button>
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
                            {filteredModules.map((mod) => {
                                const alreadyAdded = row.modules.some((m) => m.id === mod.id);
                                return (
                                    <label
                                        key={mod.id}
                                        className={`${styles.itemLabel} ${alreadyAdded ? styles.disabledItem : ""
                                            }`}
                                    >
                                        <input
                                            type="checkbox"
                                            disabled={alreadyAdded}
                                            checked={checkedModules.has(mod.id)}
                                            onChange={() => toggleModuleCheck(mod.id)}
                                        />
                                        <span className={styles.itemText}>
                                            {mod.name} ({mod.credits} CP)
                                            {alreadyAdded && (
                                                <span className={styles.alreadyAdded}>
                                                    — bereits hinzugefügt
                                                </span>
                                            )}
                                        </span>
                                    </label>
                                );
                            })}
                            {filteredModules.length === 0 && (
                                <div className={styles.noResults}>Keine Treffer</div>
                            )}
                        </div>
                    </div>

                    <div className={styles.right}>
                        <h3>Kategorien</h3>
                        <div className={styles.categoryList}>
                            {categories.map((cat) => (
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

                <div className={styles.modalFooter}>
                    <button className={styles.cancelBtn} onClick={closeModal}>
                        Abbrechen
                    </button>
                    <button className={styles.addBtnFooter} onClick={handleAdd}>
                        Hinzufügen
                    </button>
                </div>
            </div>
        </div>
    );
}
