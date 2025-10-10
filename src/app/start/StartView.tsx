"use client";

import React, { JSX, useState, useRef, useEffect } from "react";
import SemesterRow from "./components/SemesterRow";
import ValidationView from "./components/ValidationView";
import SearchModal from "./components/SearchModal";
import ModuleDetailModal from "./components/ModuleDetailModal";
import styles from "./styles/StartView.module.css";
import { Module } from "@/types/module";
import { useModuleList } from "./hooks/useModuleList";
import { useSemesters } from "./hooks/useSemesters";
import { useValidation } from "./hooks/useValidation";
import Button from "../components/Button";
import { Focus } from "@/types/focus";

export default function StartView(): JSX.Element {
    const [startSemester, setStartSemester] = useState<"winter" | "summer">("winter");
    const [focus, setFocus] = useState<Focus>({
        specialization: null,
        major1: null,
        major2: null,
        supplementary: null,
    });

    const [showModalSemester, setShowModalSemester] = useState<number | null>(null);
    const [detailModule, setDetailModule] = useState<Module | null>(null);

    // Toggle für InputView (auf-/zuklappen)
    const [inputOpen, setInputOpen] = useState(false);
    const contentRef = useRef<HTMLDivElement | null>(null);
    const [contentHeight, setContentHeight] = useState<number>(0);

    // Hooks
    const { moduleList } = useModuleList();
    const {
        semesters,
        semesterType,
        updateSemesterModules,
        moveModuleBetweenSemesters,
        handleAddModules,
    } = useSemesters({ startSemester });

    const { supplementaryCredits } = useValidation(semesters, focus);

    // Errechne Höhe des Inhalt-Containers für die Transition
    useEffect(() => {
        const el = contentRef.current;
        if (!el) return;
        // scrollHeight passt sich an, falls InputView-Inhalt sich ändert
        const updateHeight = () => setContentHeight(el.scrollHeight);
        updateHeight();

        // falls InputView dynamisch Inhalte ändert, können wir ResizeObserver nutzen (falls verfügbar)
        let ro: ResizeObserver | undefined;
        if (typeof ResizeObserver !== "undefined") {
            ro = new ResizeObserver(() => updateHeight());
            ro.observe(el);
        }

        // cleanup
        return () => {
            if (ro && el) ro.unobserve(el);
        };
    }, [startSemester, focus, supplementaryCredits, moduleList]); // Abhängigkeiten, die den Inhalt verändern können

    return (
        <main className={styles.main}>
            <div className={styles.container}>
                <header className={styles.header}>
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem", width: "100%" }}>
                        <div style={{ flex: 1 }}>
                            <h1 className={styles.title}>Study Plan – Drag & Drop Modules with Credits</h1>
                            <p className={styles.subtitle}>
                                Choose modules from the JSON file and assign them to semesters.
                            </p>
                        </div>

                        {/* Toggle-Button für InputView */}

                        <Button
                            onClick={() => setInputOpen((s) => !s)}
                            variant="secondary"
                            size="large"
                        >
                            {inputOpen ? "Hide validations" : "Show validations"}
                        </Button>
                    </div>
                </header>

                {/* Aufklappbarer Bereich: wir animieren maxHeight */}
                <div
                    id="input-view-panel"
                    ref={contentRef}
                    style={{
                        overflow: "hidden",
                        maxHeight: inputOpen ? `${contentHeight}px` : "0px",
                        transition: "max-height 280ms ease",
                    }}
                    aria-hidden={!inputOpen}
                >
                    {/* InputView bleibt gemounted, damit interner State erhalten bleibt */}
                    <div style={{ paddingTop: inputOpen ? "1rem" : 0 }}>
                        <ValidationView
                            startSemester={startSemester}
                            setStartSemester={setStartSemester}
                            semesters={semesters}
                            focus={focus}
                            setFocus={setFocus}
                        />
                    </div>
                </div>

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
