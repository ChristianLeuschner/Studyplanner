"use client";

import React, { useEffect, useState } from "react";
import styles from "./InputView.module.css";
import moduleData from "../data/master.json";
import specializations from "../data/spezializations.json";

interface InputViewProps {
    startSemester: "winter" | "summer";
    setStartSemester: (s: "winter" | "summer") => void;
    focus: {
        schwerpunkte: string | null;
        vertiefungsfach1: string | null;
        vertiefungsfach2: string | null;
        ergaenzungsfach: string | null;
    };
    setFocus: React.Dispatch<
        React.SetStateAction<{
            schwerpunkte: string | null;
            vertiefungsfach1: string | null;
            vertiefungsfach2: string | null;
            ergaenzungsfach: string | null;
        }>
    >;
}

export default function InputView({ startSemester, setStartSemester, focus, setFocus }: InputViewProps) {
    const [vertiefungsfächer, setVertiefungsfächer] = useState<string[]>([]);
    const [ergaenzungsfächer, setErgaenzungsfächer] = useState<string[]>([]);

    useEffect(() => {
        // Vertiefungsfächer extrahieren
        const vertiefungSet = new Set<string>();
        const ergaenzungSet = new Set<string>();

        moduleData.forEach((mod: any) => {
            mod.partOf?.forEach((p: string) => {
                // Vertiefungsfach
                if (p.startsWith("Vertiefungsfach:")) {
                    let name = p.replace("Vertiefungsfach:", "").trim();
                    // alles in Klammern entfernen, z.B. (EV bis 31.03.2025)
                    name = name.replace(/\(.*\)/, "").trim();
                    vertiefungSet.add(name);
                }
                // Ergänzungsfach
                if (p.startsWith("Ergänzungsfach:")) {
                    let name = p.replace("Ergänzungsfach:", "").trim();
                    name = name.replace(/\(.*\)/, "").trim();
                    ergaenzungSet.add(name);
                }
            });
        });

        setVertiefungsfächer(Array.from(vertiefungSet).sort());
        setErgaenzungsfächer(Array.from(ergaenzungSet).sort());
    }, []);

    return (
        <div className={styles.container}>
            {/* Startsemester */}
            <label className={styles.label} htmlFor="startSemester">Startsemester:</label>
            <select
                id="startSemester"
                className={styles.select}
                value={startSemester}
                onChange={(e) => setStartSemester(e.target.value as "winter" | "summer")}
            >
                <option value="winter">Wintersemester</option>
                <option value="summer">Sommersemester</option>
            </select>

            {/* Schwerpunkt */}
            <label className={styles.label} htmlFor="schwerpunkt">Schwerpunkt:</label>
            <select
                id="schwerpunkt"
                className={styles.select}
                value={focus.schwerpunkte ?? ""}
                onChange={(e) => setFocus({ ...focus, schwerpunkte: e.target.value })}
            >
                <option value="">-- select --</option>
                {specializations.map((s) => (
                    <option key={s} value={s}>{s}</option>
                ))}
            </select>

            {/* Vertiefungsfach 1 */}
            <label className={styles.label} htmlFor="vertiefungsfach1">Vertiefungsfach 1:</label>
            <select
                id="vertiefungsfach1"
                className={styles.select}
                value={focus.vertiefungsfach1 ?? ""}
                onChange={(e) => setFocus({ ...focus, vertiefungsfach1: e.target.value })}
            >
                <option value="">-- select --</option>
                {vertiefungsfächer.map((v) => (
                    <option key={v} value={v}>{v}</option>
                ))}
            </select>

            {/* Vertiefungsfach 2 */}
            <label className={styles.label} htmlFor="vertiefungsfach2">Vertiefungsfach 2:</label>
            <select
                id="vertiefungsfach2"
                className={styles.select}
                value={focus.vertiefungsfach2 ?? ""}
                onChange={(e) => setFocus({ ...focus, vertiefungsfach2: e.target.value })}
            >
                <option value="">-- select --</option>
                {vertiefungsfächer.map((v) => (
                    <option key={v} value={v}>{v}</option>
                ))}
            </select>

            {/* Ergänzungsfach */}
            <label className={styles.label} htmlFor="ergaenzungsfach">Ergänzungsfach:</label>
            <select
                id="ergaenzungsfach"
                className={styles.select}
                value={focus.ergaenzungsfach ?? ""}
                onChange={(e) => setFocus({ ...focus, ergaenzungsfach: e.target.value })}
            >
                <option value="">-- select --</option>
                {ergaenzungsfächer.map((e) => (
                    <option key={e} value={e}>{e}</option>
                ))}
            </select>
        </div>
    );
}
