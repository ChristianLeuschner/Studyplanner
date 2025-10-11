"use client";

import React, { useState } from "react";
import Button from "../../components/Button";
import styles from "../styles/ExportMenuView.module.css";

interface ExportMenuProps {
  exportData: any;
}

export default function ExportMenu({ exportData }: ExportMenuProps) {
  const [open, setOpen] = useState(false);

  const handleExport = (type: "json" | "pdf" | "jpg") => {
    setOpen(false);
    if (type === "json") {
      exportAsJSON(exportData);
    } else if (type === "pdf") {
      alert("PDF-Export noch nicht implementiert 😅");
    } else if (type === "jpg") {
      alert("JPG-Export noch nicht implementiert 😅");
    }
  };

  return (
    <div className={styles.exportMenu}>
      <Button
        onClick={() => setOpen((prev) => !prev)}
        variant="primary"
        size="large"
      >
        Export
      </Button>

      {open && (
        <div className={styles.dropdown}>
          <button
            onClick={() => handleExport("json")}
            className={styles.menuItem}
          >
            JSON
          </button>
          <button
            onClick={() => handleExport("pdf")}
            className={styles.menuItem}
          >
            PDF
          </button>
          <button
            onClick={() => handleExport("jpg")}
            className={styles.menuItem}
          >
            JPG
          </button>
        </div>
      )}
    </div>
  );
}

// --- Export-Funktion für JSON ---
function exportAsJSON(data: any) {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "studyplan.json";
  link.click();
  URL.revokeObjectURL(url);
}
