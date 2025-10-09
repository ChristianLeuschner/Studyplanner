"use client";

import React, { useEffect, useState } from "react";
import styles from "../styles/ValidationView.module.css";
import moduleData from "../../../data/master.json";
import specializations from "../../../data/spezializations.json";
import ValidationDetailView from "./ValidationDetailView";
import { Semester } from "@/types/semester";

interface ValidationViewProps {
    startSemester: "winter" | "summer";
    setStartSemester: (s: "winter" | "summer") => void;
    semesters: Semester[];
    focus: {
        specialization: string | null;
        major1: string | null;
        major2: string | null;
        elective: string | null;
    };
    setFocus: React.Dispatch<
        React.SetStateAction<{
            specialization: string | null;
            major1: string | null;
            major2: string | null;
            elective: string | null;
        }>
    >;
}

export default function ValidationView({
    startSemester,
    setStartSemester,
    semesters,
    focus,
    setFocus,
}: ValidationViewProps) {
    const [majors, setMajors] = useState<string[]>([]);
    const [electives, setElectives] = useState<string[]>([]);

    useEffect(() => {
        const majorSet = new Set<string>();
        const electiveSet = new Set<string>();

        moduleData.forEach((mod: any) => {
            mod.partOf?.forEach((p: string) => {
                if (p.startsWith("Vertiefungsfach:")) {
                    let name = p.replace("Vertiefungsfach:", "").trim();
                    name = name.replace(/\(.*\)/, "").trim();
                    majorSet.add(name);
                }
                if (p.startsWith("Ergänzungsfach:")) {
                    let name = p.replace("Ergänzungsfach:", "").trim();
                    name = name.replace(/\(.*\)/, "").trim();
                    electiveSet.add(name);
                }
            });
        });

        setMajors(Array.from(majorSet).sort());
        setElectives(Array.from(electiveSet).sort());
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.inputsContainer}>
                <label className={styles.label} htmlFor="startSemester">Start Semester:</label>
                <select
                    id="startSemester"
                    className={styles.select}
                    value={startSemester}
                    onChange={e => setStartSemester(e.target.value as "winter" | "summer")}
                >
                    <option value="winter">Winter</option>
                    <option value="summer">Summer</option>
                </select>

                <label className={styles.label} htmlFor="specialization">Specialization:</label>
                <select
                    id="specialization"
                    className={styles.select}
                    value={focus.specialization ?? ""}
                    onChange={e => setFocus({ ...focus, specialization: e.target.value })}
                >
                    <option value="">-- select --</option>
                    {specializations.map(s => <option key={s} value={s}>{s}</option>)}
                </select>

                <label className={styles.label} htmlFor="major1">Major 1:</label>
                <select
                    id="major1"
                    className={styles.select}
                    value={focus.major1 ?? ""}
                    onChange={e => setFocus({ ...focus, major1: e.target.value })}
                >
                    <option value="">-- select --</option>
                    {majors.map(m => <option key={m} value={m}>{m}</option>)}
                </select>

                <label className={styles.label} htmlFor="major2">Major 2:</label>
                <select
                    id="major2"
                    className={styles.select}
                    value={focus.major2 ?? ""}
                    onChange={e => setFocus({ ...focus, major2: e.target.value })}
                >
                    <option value="">-- select --</option>
                    {majors.map(m => <option key={m} value={m}>{m}</option>)}
                </select>

                <label className={styles.label} htmlFor="elective">Elective:</label>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <select
                        id="elective"
                        className={styles.select}
                        value={focus.elective ?? ""}
                        onChange={e => setFocus({ ...focus, elective: e.target.value })}
                    >
                        <option value="">-- select --</option>
                        {electives.map(e => <option key={e} value={e}>{e}</option>)}
                    </select>
                </div>
            </div>
            <ValidationDetailView semesters={semesters} focus={focus} />
        </div>
    );
}
