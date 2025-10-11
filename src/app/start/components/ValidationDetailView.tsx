import { Focus } from "@/types/focus";
import { Semester } from "@/types/semester";
import { useValidation } from "../hooks/useValidation";
import styles from "../styles/ValidationDetailView.module.css";

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
        supplementaryCredits,
        isSupplementaryValid,
        electiveCredits,
        isElectiveValid,
        major1Credits,
        isMajor1Valid,
        major2Credits,
        isMajor2Valid,
        othersCredits,
        isOthersValid } = useValidation(semesters, focus);

    return (
        <div className={styles.container}>
            <label className={styles.label}>State</label>
            <label className={styles.label}>Requirements</label>
            <label className={styles.label}>Message</label>

            <label className={styles.label}>Total credits: {totalCredits}</label>
            <label className={styles.label}>(Min. 120)</label>
            <label className={`${styles.label} ${isTotalValid ? styles.ok : styles.error}`}>
                {isTotalValid ? "OK" : "Check requirements on top"}
            </label>

            <label className={styles.label}>Major 1 credits: {major1Credits}</label>
            <label className={styles.label}>(Min. 15)</label>
            <label className={`${styles.label} ${isMajor1Valid ? styles.ok : styles.error}`}>
                {isMajor1Valid ? "OK" : "Check requirements on top"}
            </label>

            <label className={styles.label}>Major 2 credits: {major2Credits}</label>
            <label className={styles.label}>(Min. 15)</label>
            <label className={`${styles.label} ${isMajor2Valid ? styles.ok : styles.error}`}>
                {isMajor2Valid ? "OK" : "Check requirements on top"}
            </label>

            <label className={styles.label}>Supplementary credits: {supplementaryCredits}</label>
            <label className={styles.label}>(Min. 9, Max. 18)</label>
            <label className={`${styles.label} ${isSupplementaryValid ? styles.ok : styles.error}`}>
                {isSupplementaryValid ? "OK" : "Check requirements on top"}
            </label>

            <label className={styles.label}>Elective credits: {electiveCredits}</label>
            <label className={styles.label}>(Max. 49)</label>
            <label className={`${styles.label} ${isElectiveValid ? styles.ok : styles.error}`}>
                {isElectiveValid ? "OK" : "Check requirements on top"}
            </label>

            <label className={styles.label}>Überfachliche Qualifikationen credits: {othersCredits}</label>
            <label className={styles.label}>(Min.2 , Max. 6)</label>
            <label className={`${styles.label} ${isOthersValid ? styles.ok : styles.error}`}>
                {isOthersValid ? "OK" : "Check requirements on top"}
            </label>


            <label className={styles.label}># Base Modules: {baseModuleCount}</label>
            <label className={styles.label}>(Min. 4)</label>
            <label className={`${styles.label} ${isBaseModuleValid ? styles.ok : styles.error}`}>
                {isBaseModuleValid ? "OK" : "Check requirements on top"}
            </label>

            <label className={styles.error}>KEINE GARANTIE AUF VOLLSTÄNDIGKEIT: BITTE FINAL IM MODULHANDBUCH PRÜFEN</label>


        </div>
    );
}
