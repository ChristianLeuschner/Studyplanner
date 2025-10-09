"use client";

import React, { JSX, useState } from "react";
import SemesterRow from "./components/SemesterRow";
import InputView from "./components/InputView";
import SearchModal from "./components/SearchModal";
import ModuleDetailModal from "./components/ModuleDetailModal";
import styles from "./styles/StartView.module.css";
import { Module } from "@/types/module";
import { useModuleList } from "./hooks/useModuleList";
import { useSemesters } from "./hooks/useSemesters";
import { useValidation } from "./hooks/useValidation";

interface Focus {
    schwerpunkte: string | null;
    vertiefungsfach1: string | null;
    vertiefungsfach2: string | null;
    ergaenzungsfach: string | null;
}

export default function StartView(): JSX.Element {
    const [startSemester, setStartSemester] = useState<"winter" | "summer">("winter");
    const [focus, setFocus] = useState<Focus>({
        schwerpunkte: null,
        vertiefungsfach1: null,
        vertiefungsfach2: null,
        ergaenzungsfach: null,
    });

    const [showModalSemester, setShowModalSemester] = useState<number | null>(null);
    const [detailModule, setDetailModule] = useState<Module | null>(null);

    // 🔹 Hooks nutzen
    const { moduleList } = useModuleList();
    const {
        semesters,
        semesterType,
        updateSemesterModules,
        moveModuleBetweenSemesters,
        handleAddModules,
    } = useSemesters({ startSemester });

    const { ergaenzungsfachCredits } = useValidation(semesters, focus);

    return (
        <main className={styles.main}>
            <div className={styles.container}>
                <header className={styles.header}>
                    <h1 className={styles.title}>Study Plan – Drag & Drop Modules with Credits</h1>
                    <p className={styles.subtitle}>
                        Choose modules from the JSON file and assign them to semesters.
                    </p>
                </header>

                <InputView
                    startSemester={startSemester}
                    setStartSemester={setStartSemester}
                    focus={focus}
                    setFocus={setFocus}
                    ergaenzungsfachCredits={ergaenzungsfachCredits}
                />

                <section className={styles.section}>
                    {semesters.map((sem) => (
                        <SemesterRow
                            key={sem.id}
                            semester={sem}
                            showModal={() => setShowModalSemester(sem.id)}
                            moveModuleBetweenSemesters={moveModuleBetweenSemesters}
                            updateSemesterModules={updateSemesterModules}
                            onModuleClick={(mod) => setDetailModule(mod)}
                            semesterType={semesterType(sem.id)}
                        />
                    ))}
                </section>

                {showModalSemester !== null && (
                    <SearchModal
                        modules={moduleList}
                        semester={semesters.find((s) => s.id === showModalSemester)!}
                        closeModal={() => setShowModalSemester(null)}
                        addModules={(mods) => handleAddModules(showModalSemester, mods)}
                    />
                )}

                {detailModule && (
                    <ModuleDetailModal module={detailModule} close={() => setDetailModule(null)} />
                )}
            </div>
        </main>
    );
}
