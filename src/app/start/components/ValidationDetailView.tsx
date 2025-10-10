import { Focus } from "@/types/focus";
import { Semester } from "@/types/semester";
import { useValidation } from "../hooks/useValidation";
import styles from "../styles/ValidationDetailView.module.css";

interface ValidationDetailViewProps {
    semesters: Semester[];
    focus: Focus;
}

export default function ValidationDetailView({ semesters, focus }: ValidationDetailViewProps) {
    const { totalCredits, isTotalValid, supplementaryCredits, isSupplementaryValid } = useValidation(semesters, focus);

    return (
        <div className={styles.container}>
            <label className={styles.label}>State</label>
            <label className={styles.label}>Requirements</label>
            <label className={styles.label}>Message</label>

            <label className={styles.label}>Total credits: {supplementaryCredits}</label>
            <label className={styles.label}>(Min. 120)</label>
            <label className={`${styles.label} ${isTotalValid ? styles.ok : styles.error}`}>
                {isTotalValid ? "OK" : "Check requirements on top"}
            </label>

            <label className={styles.label}>Supplementary credits: {supplementaryCredits}</label>
            <label className={styles.label}>(Min. 9, Max. 18)</label>
            <label className={`${styles.label} ${isSupplementaryValid ? styles.ok : styles.error}`}>
                {isSupplementaryValid ? "OK" : "Check requirements on top"}
            </label>
        </div>
    );
}
