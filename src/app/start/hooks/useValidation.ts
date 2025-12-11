import { useState, useEffect } from "react";
import { Semester } from "@/types/semester";
import { Focus } from "@/types/focus";
import { Affiliation, ModuleType } from "@/utils/enums";
import base_modules from "../../../data/base_modules.json";
import special_ai from "../../../data/special_ai.json";

// TODO: validate praktika/seminare, stammmodule, specialization
export function useValidation(semesters: Semester[], focus: Focus) {
    //over all
    const [totalCredits, setTotalCredits] = useState(0);
    const [isTotalValid, setIsTotalValid] = useState(false);
    // base modules
    const [baseModuleCount, setBaseModuleCount] = useState(0);
    const [isBaseModuleValid, setIsBaseModuleValid] = useState(false);

    // typeRestrictions
    const [seminarCredits, setSeminarCredits] = useState(0);
    const [isSeminarValid, setIsSeminarValid] = useState(false);
    const [praktikumCredits, setPraktikumCredits] = useState(0);
    const [isPraktikumValid, setIsPraktikumValid] = useState(false);
    const [semOrPrakCredits, setSemOrPrakCredits] = useState(0);
    const [isSemOrPrakValid, setIsSemOrPrakValid] = useState(false);

    // specializations
    const [specialBmCredits, setSpecialBmCredits] = useState(0);
    const [specialElectiveCredits, setSpecialElectiveCredits] = useState(0);
    const [isSpecializationValid, setIsSpecializationValid] = useState(false);

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


    // specialization validation
    useEffect(() => {
        if (!focus.specialization) {
            setIsSpecializationValid(true);
            return;
        }
        // TODO: implement specialization validation
        validateSpecialization();
    }, [semesters, focus.specialization]);

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

    // over all validation
    useEffect(() => {
        // total credits
        const total = semesters
            .flatMap((s) => s.modules)
            .reduce((sum, m) => sum + m.credits, 0);
        setTotalCredits(total);
        setIsTotalValid(total >= 120);

        // base modules
        const count = semesters
            .flatMap((s) => s.modules)
            .filter((mod) => base_modules.some((bm: any) => bm === mod.id))
            .length;
        setBaseModuleCount(count);
        setIsBaseModuleValid(count >= 4);

        // type restrictions
        const seminarC = semesters
            .flatMap((s) => s.modules)
            .filter((mod) => mod.affiliation === Affiliation.Major1 || mod.affiliation === Affiliation.Major2 || mod.affiliation === Affiliation.Elective)
            .filter((mod) => mod.type === ModuleType.Seminar)
            .reduce((sum, m) => sum + m.credits, 0);
        setSeminarCredits(seminarC);
        setIsSeminarValid(seminarC >= 3);

        const praktikumC = semesters
            .flatMap((s) => s.modules)
            .filter((mod) => mod.affiliation === Affiliation.Major1 || mod.affiliation === Affiliation.Major2 || mod.affiliation === Affiliation.Elective)
            .filter((mod) => mod.type === ModuleType.Internship)
            .reduce((sum, m) => sum + m.credits, 0);
        setPraktikumCredits(praktikumC);
        setIsPraktikumValid(praktikumC >= 6);

        setSemOrPrakCredits(seminarC + praktikumC);
        setIsSemOrPrakValid((seminarC + praktikumC) >= 12 && (seminarC + praktikumC) <= 18);

    }, [semesters]);

    const validateSpecialization = () => {
        switch (focus.specialization) {
            case "Artificial Intelligence":
                const modules = semesters
                    .flatMap((s) => s.modules)
                const specialBaseModuleCredits = modules
                    .filter((mod) => special_ai.mandatory.some((id: any) => id === mod.id))
                    .reduce((sum, m) => sum + m.credits, 0);
                const electiveCredits = modules
                    .filter((mod) => special_ai.elective.some((id: any) => id === mod.id))
                    .reduce((sum, m) => sum + m.credits, 0);
                // TODO: set validation state
                setSpecialBmCredits(specialBaseModuleCredits);
                setSpecialElectiveCredits(electiveCredits);
                setIsSpecializationValid(specialBaseModuleCredits >= 6 && electiveCredits >= 39 && electiveCredits + specialBaseModuleCredits >= 45);
        }
    }

    return {
        totalCredits: totalCredits,
        isTotalValid: isTotalValid,
        baseModuleCount: baseModuleCount,
        isBaseModuleValid: isBaseModuleValid,
        seminarCredits: seminarCredits,
        isSeminarValid: isSeminarValid,
        praktikumCredits: praktikumCredits,
        isPraktikumValid: isPraktikumValid,
        semOrPrakCredits: semOrPrakCredits,
        isSemOrPrakValid: isSemOrPrakValid,
        specialBmCredits: specialBmCredits,
        specialElectiveCredits: specialElectiveCredits,
        isSpecializationValid: isSpecializationValid,
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
