import { useState, useEffect, use } from "react";
import { Semester } from "@/types/semester";
import { Focus } from "@/types/focus";

export function useValidation(semesters: Semester[], focus: Focus) {
    //overAll
    const [totalCredits, setTotalCredits] = useState(0);
    const [isTotalValid, setIsTotalValid] = useState(false);
    // supplementary
    const [supplementaryCredits, setsupplementaryCredits] = useState(0);
    const [isSupplementaryValid, setisSupplementaryValid] = useState(false);
    // TODO: add more validation states here
    useEffect(() => {
        if (!focus.supplementary) {
            setsupplementaryCredits(0);
            return;
        }

        const totalCredits = semesters
            .flatMap((s) => s.modules)
            .filter((mod) => mod.partOf.some((p) => p === focus.supplementary))
            .reduce((sum, m) => sum + m.credits, 0);

        setsupplementaryCredits(totalCredits);
        setisSupplementaryValid(totalCredits >= 9 && totalCredits <= 18);
    }, [semesters, focus.supplementary]);

    useEffect(() => {
        const total = semesters
            .flatMap((s) => s.modules)
            .reduce((sum, m) => sum + m.credits, 0);
        setTotalCredits(total);
        setIsTotalValid(total >= 120);
    }, [semesters]);

    return { totalCredits: totalCredits, isTotalValid: isTotalValid, supplementaryCredits: supplementaryCredits, isSupplementaryValid: isSupplementaryValid };
}
