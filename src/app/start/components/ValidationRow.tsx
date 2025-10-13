// components/ValidationRow.tsx
import React, { JSX } from "react";
import styles from "../styles/ValidationDetailView.module.css";

interface ValidationRowProps {
    name: string;
    value: number | string;
    requirement: string;
    isValid: boolean;
}

export default function ValidationRow({ name, value, requirement, isValid }: ValidationRowProps): JSX.Element {
    return (
        <>
            <label className={styles.label}>{name}: {value}</label>
            <label className={styles.label}>({requirement})</label>
            <label className={`${styles.label} ${isValid ? styles.ok : styles.error}`}>
                {isValid ? "OK" : "Check requirements"}
            </label>
        </>
    );
}
