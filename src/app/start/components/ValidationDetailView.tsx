import { Focus } from "@/types/focus";
import { Semester } from "@/types/semester";
import { useValidation } from "../hooks/useValidation";
import styles from "../styles/ValidationDetailView.module.css";
import ValidationRow from "../components/ValidationRow";

interface ValidationDetailViewProps {
    semesters: Semester[];
    focus: Focus;
}

export default function ValidationDetailView({ semesters, focus }: ValidationDetailViewProps) {
    const {
        totalCredits,
        isTotalValid,
        baseModuleCount,
        isBaseModuleValid,
        seminarCredits,
        isSeminarValid,
        praktikumCredits,
        isPraktikumValid,
        semOrPrakCredits,
        isSemOrPrakValid,
        supplementaryCredits,
        isSupplementaryValid,
        electiveCredits,
        isElectiveValid,
        major1Credits,
        isMajor1Valid,
        major2Credits,
        isMajor2Valid,
        othersCredits,
        isOthersValid
    } = useValidation(semesters, focus);

    return (
        <div className={styles.container}>
            <label className={styles.label}>State</label>
            <label className={styles.label}>Requirements</label>
            <label className={styles.label}>Message</label>

            <ValidationRow name="Total credits" value={totalCredits} requirement="Min. 120" isValid={isTotalValid} />
            <ValidationRow name="Major 1 credits" value={major1Credits} requirement="Min. 15" isValid={isMajor1Valid} />
            <ValidationRow name="Major 2 credits" value={major2Credits} requirement="Min. 15" isValid={isMajor2Valid} />
            <ValidationRow name="Supplementary credits" value={supplementaryCredits} requirement="Min. 9, Max. 18" isValid={isSupplementaryValid} />
            <ValidationRow name="Elective credits" value={electiveCredits} requirement="Max. 49" isValid={isElectiveValid} />
            <ValidationRow name="Überfachliche Qualifikationen credits" value={othersCredits} requirement="Min.2, Max.6" isValid={isOthersValid} />
            <ValidationRow name="# Base Modules" value={baseModuleCount} requirement="Min. 4" isValid={isBaseModuleValid} />
            <ValidationRow name="Seminar credits" value={seminarCredits} requirement="Min. 3" isValid={isSeminarValid} />
            <ValidationRow name="Internship credits" value={praktikumCredits} requirement="Min. 6" isValid={isPraktikumValid} />
            <ValidationRow name="Seminar or internship credits" value={semOrPrakCredits} requirement="Min. 12, Max. 18" isValid={isSemOrPrakValid} />

            <label className={styles.error}>
                KEINE GARANTIE AUF VOLLSTÄNDIGKEIT: BITTE FINAL IM MODULHANDBUCH PRÜFEN ZU BEDENKEN: CREDITS AN VL AUS MAJOR OHNE BASE MODULE
            </label>
        </div>
    );
}
