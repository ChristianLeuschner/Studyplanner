// src/utils/useExportStudyPlan.ts
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function useExportStudyPlan() {
    const exportAsJSON = (data: any) => {
        const jsonString = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonString], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "studyplan.json";
        link.click();
        URL.revokeObjectURL(url);
    };

    const exportAsPDF = (data: any) => {
        const doc = new jsPDF();
        doc.text("Study Plan", 14, 15);
        let yPos = 25;
        data.semesters.forEach((sem: any, i: number) => {
            const totalECTS = sem.modules?.reduce((s: number, m: any) => s + (m.credits || 0), 0) || 0;
            doc.text(`${sem.name || `Semester ${sem.id}`} (${totalECTS} ECTS)`, 14, yPos);
            const rows = sem.modules.map((m: any) => [m.name || "-", m.credits ?? "-"]);
            yPos += 5;
            autoTable(doc, {
                head: [["Module", "ECTS"]],
                body: rows,
                startY: yPos,
            });
            yPos = (doc as any).lastAutoTable.finalY + 12;
            if (yPos > 260 && i < data.semesters.length - 1) {
                doc.addPage();
                yPos = 25;
            }
        });
        doc.save("studyplan.pdf");
    };

    return { exportAsJSON, exportAsPDF };
}
