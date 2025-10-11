"use client";

import React, { useRef } from "react";
import Button from "../../components/Button";

interface ImportButtonProps {
    onImport: (data: any) => void; // Callback zum Hochladen der Daten in StartView
}

export default function ImportButton({ onImport }: ImportButtonProps) {
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    // Klick auf Button → verstecktes Input öffnen
    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    // Wenn Datei gewählt wurde
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.name.endsWith(".json")) {
            alert("Bitte eine JSON-Datei auswählen.");
            return;
        }

        try {
            const text = await file.text();
            const jsonData = JSON.parse(text);
            onImport(jsonData); // Übergibt Daten an Parent-Komponente
        } catch (err) {
            console.error("Fehler beim Lesen der JSON:", err);
            alert("Die Datei konnte nicht gelesen werden. Ist sie gültiges JSON?");
        } finally {
            // Reset Input, damit man dieselbe Datei nochmal auswählen kann
            e.target.value = "";
        }
    };

    return (
        <div style={{ display: "inline-block" }}>
            <input
                type="file"
                accept=".json"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: "none" }}
            />
            <Button onClick={handleButtonClick} variant="primary" size="large">
                Import Studyplan
            </Button>
        </div>
    );
}
