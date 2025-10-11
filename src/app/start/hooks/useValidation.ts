import { useState, useEffect } from "react";
import { Semester } from "@/types/semester";
import { Focus } from "@/types/focus";
import { Affiliation } from "@/utils/enums";

// TODO: validate praktika/seminare, stammmodule, specialization
export function useValidation(semesters: Semester[], focus: Focus) {
    //over all
    const [totalCredits, setTotalCredits] = useState(0);
    const [isTotalValid, setIsTotalValid] = useState(false);
    // supplementary
    const [supplementaryCredits, setSupplementaryCredits] = useState(0);
    const [isSupplementaryValid, setIsSupplementaryValid] = useState(false);
    // major1
    const [major1Credits, setMajor1Credits] = useState(0);
    const [isMajor1Valid, setIsMajor1Valid] = useState(false);
    // major2
    const [major2Credits, setMajor2Credits] = useState(0);
    const [isMajor2Valid, setIsMajor2Valid] = useState(false);
    // elective
    const [electiveCredits, setElectiveCredits] = useState(0);
    const [isElectiveValid, setIsElectiveValid] = useState(false);
    // others
    const [othersCredits, setOthersCredits] = useState(0);
    const [isOthersValid, setIsOthersValid] = useState(false);



    // supplementary validation
    useEffect(() => {
        if (!focus.supplementary) {
            setSupplementaryCredits(0);
            return;
        }

        const supplCredits = semesters
            .flatMap((s) => s.modules)
            .filter((mod) => mod.affiliation === Affiliation.Supplementary)
            .reduce((sum, m) => sum + m.credits, 0);

        setSupplementaryCredits(supplCredits);
        setIsSupplementaryValid(supplCredits >= 9 && supplCredits <= 18);
    }, [semesters, focus.supplementary]);

    // major1 validation
    useEffect(() => {
        if (!focus.major1) {
            setMajor1Credits(0);
            return;
        }
        const maj1Credits = semesters
            .flatMap((s) => s.modules)
            .filter((mod) => mod.affiliation === Affiliation.Major1)
            .reduce((sum, m) => sum + m.credits, 0);

        setMajor1Credits(maj1Credits);
        setIsMajor1Valid(maj1Credits >= 15 && maj1Credits <= 52);
    }, [semesters, focus.major1]);

    // major2 validation
    useEffect(() => {
        if (!focus.major2) {
            setMajor2Credits(0);
            return;
        }
        const maj2Credits = semesters
            .flatMap((s) => s.modules)
            .filter((mod) => mod.affiliation === Affiliation.Major2)
            .reduce((sum, m) => sum + m.credits, 0);

        setMajor2Credits(maj2Credits);
        setIsMajor2Valid(maj2Credits >= 15 && maj2Credits <= 52);
    }, [semesters, focus.major2]);

    // elective validation
    useEffect(() => {
        const electCredits = semesters
            .flatMap((s) => s.modules)
            .filter((mod) => mod.affiliation === Affiliation.Elective)
            .reduce((sum, m) => sum + m.credits, 0);

        setElectiveCredits(electCredits);
        setIsElectiveValid(electCredits <= 49);
    }, [semesters]);

    // others validation
    useEffect(() => {
        const othersCredits = semesters
            .flatMap((s) => s.modules)
            .filter((mod) => mod.affiliation === Affiliation.Others)
            .reduce((sum, m) => sum + m.credits, 0);

        setOthersCredits(othersCredits);
        setIsOthersValid(othersCredits >= 2 && othersCredits <= 6);
    }, [semesters]);

    // total validation
    useEffect(() => {
        const total = semesters
            .flatMap((s) => s.modules)
            .reduce((sum, m) => sum + m.credits, 0);
        setTotalCredits(total);
        setIsTotalValid(total >= 120);
    }, [semesters]);

    return {
        totalCredits: totalCredits,
        isTotalValid: isTotalValid,
        supplementaryCredits: supplementaryCredits,
        isSupplementaryValid: isSupplementaryValid,
        major1Credits: major1Credits,
        isMajor1Valid: isMajor1Valid,
        major2Credits: major2Credits,
        isMajor2Valid: isMajor2Valid,
        electiveCredits: electiveCredits,
        isElectiveValid: isElectiveValid,
        othersCredits: othersCredits,
        isOthersValid: isOthersValid
    };
}
