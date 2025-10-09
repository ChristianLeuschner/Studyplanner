import { useState, useEffect } from "react";
import { Semester } from "@/types/semester";
import { Focus } from "@/types/focus";

/**
 * Berechnet automatisch die Credits des aktuellen Ergänzungsfachs,
 * basierend auf den Modulen in allen Semestern.
 */
export function useValidation(semesters: Semester[], focus: Focus) {
    // elective
    const [electiveCredits, setElectiveCredits] = useState(0);
    const [isElectiveValid, setIsElectiveValid] = useState(false);

    useEffect(() => {
        if (!focus.elective) {
            setElectiveCredits(0);
            return;
        }

        const totalCredits = semesters
            .flatMap((s) => s.modules)
            .filter((mod) => mod.partOf.some((p) => p === focus.elective))
            .reduce((sum, m) => sum + m.credits, 0);

        setElectiveCredits(totalCredits);
        if (totalCredits >= 9 && totalCredits <= 18) {
            setIsElectiveValid(true);
        } else {
            setIsElectiveValid(false);
        }
    }, [semesters, focus.elective]);

    return { electiveCredits: electiveCredits, isElectiveValid: isElectiveValid };
}
