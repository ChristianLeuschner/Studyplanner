"use client";

import React from "react";
import { X } from "lucide-react";
import styles from "../styles/ModuleDetailModal.module.css";
import { Module } from "@/types/module";
import special_ai from "../../../data/special_ai.json";

interface ModuleDetailModalProps {
    module: Module;
    close: () => void;
}

export default function ModuleDetailModal({ module, close }: ModuleDetailModalProps) {

    const partofSpecial = special_ai.mandatory.includes(module.id) || special_ai.elective.includes(module.id);
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
                        <strong>Part of:</strong>{" "}
                        {module.partOf && module.partOf.length > 0 ? module.partOf.join(", ") : "—"}
                    </div>
                    <div>
                        <strong>Credits:</strong> {module.credits ?? "—"}
                    </div>
                    <div>
                        <strong>Offered:</strong> {module.turnus ?? "—"}
                    </div>
                    <div>
                        <strong>Language:</strong> {module.language ?? "—"}
                    </div>
                    <div>
                        <strong>Responsible:</strong> {module.responsible ?? "—"}
                    </div>
                    <div>
                        <strong>Chosen affiliation:</strong> {module.affiliation ?? "—"}
                    </div>


                    <div>
                        <strong>TEST type:</strong> {module.type ?? "—"}
                    </div>
                    <div>
                        <strong>TEST part of specialication:</strong> {String(partofSpecial)}
                    </div>
                </div>

                <div className={styles.description}>
                    <strong>Description:</strong>
                    <p>{module.description || "No description available."}</p>
                </div>
            </div>
        </div>
    );
}
