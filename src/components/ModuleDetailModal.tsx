"use client";

import React from "react";
import { X } from "lucide-react";
import { Module } from "./GridView";
import styles from "./ModuleDetailModal.module.css";

interface ModuleDetailModalProps {
    module: Module;
    close: () => void;
}

export default function ModuleDetailModal({ module, close }: ModuleDetailModalProps) {
    return (
        <div className={styles.overlay} onClick={close}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <h2 className={styles.title}>
                        {module.name} <span className={styles.moduleId}>({module.id})</span>
                    </h2>
                    <button onClick={close} className={styles.closeBtn}>
                        <X size={20} />
                    </button>
                </div>

                <div className={styles.meta}>
                    <div>
                        <strong>Bestandteil von:</strong>{" "}
                        {module.partOf && module.partOf.length > 0 ? module.partOf.join(", ") : "—"}
                    </div>
                    <div>
                        <strong>Credits:</strong> {module.credits ?? "—"}
                    </div>
                    <div>
                        <strong>Turnus:</strong> {module.turnus ?? "—"}
                    </div>
                    <div>
                        <strong>Sprache:</strong> {module.language ?? "—"}
                    </div>
                    <div>
                        <strong>Verantwortlich:</strong> {module.responsible ?? "—"}
                    </div>
                </div>

                <div className={styles.description}>
                    <strong>Beschreibung:</strong>
                    <p>{module.description || "Keine Beschreibung vorhanden."}</p>
                </div>
            </div>
        </div>
    );
}
