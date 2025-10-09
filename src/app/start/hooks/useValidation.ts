import { useState, useEffect } from "react";
import { Semester } from "@/types/semester";
import { Focus } from "@/types/focus";

/**
 * Berechnet automatisch die Credits des aktuellen Ergänzungsfachs,
 * basierend auf den Modulen in allen Semestern.
 */
export function useValidation(semesters: Semester[], focus: Focus) {
    const [ergaenzungsfachCredits, setErgaenzungsfachCredits] = useState(0);

    useEffect(() => {
        if (!focus.elective) {
            setErgaenzungsfachCredits(0);
            return;
        }

        const totalCredits = semesters
            .flatMap((s) => s.modules)
            .filter((mod) => mod.partOf.some((p) => p === focus.elective))
            .reduce((sum, m) => sum + m.credits, 0);

        setErgaenzungsfachCredits(totalCredits);
    }, [semesters, focus.elective]);

    return { ergaenzungsfachCredits };
}
