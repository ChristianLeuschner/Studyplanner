"use client";

import React, { useState } from "react";
import Button from "../../components/Button";
import styles from "../styles/ExportMenuView.module.css";
import { useExportStudyPlan } from "../hooks/useExport";

interface ExportMenuProps {
  exportData: {
    semesters: any[];
    focus: any;
    startSemester: any;
  };
}

export default function ExportMenu({ exportData }: ExportMenuProps) {
  const [open, setOpen] = useState(false);
  const { exportAsJSON, exportAsPDF } = useExportStudyPlan();

  const handleExport = async (type: "json" | "pdf") => {
    setOpen(false);
    if (type === "json") exportAsJSON(exportData);
    else if (type === "pdf") await exportAsPDF(exportData);
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
          <button onClick={() => handleExport("json")} className={styles.menuItem}>
            Export as JSON
          </button>
          <button onClick={() => handleExport("pdf")} className={styles.menuItem}>
            Export as PDF (Table)
          </button>
        </div>
      )}
    </div>
  );
}