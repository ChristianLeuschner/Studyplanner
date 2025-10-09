"use client";

import React, { ButtonHTMLAttributes, JSX } from "react";
import styles from "./Button.module.css";

type ButtonVariant = "primary" | "secondary" | "success" | "danger" | "custom";

type ButtonSize = "small" | "medium" | "large";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;          // Farbe / Typ
    size?: ButtonSize;                // Größe
    customColor?: string;             // Farbe bei variant="custom"
}

export default function Button({
    variant = "primary",
    size = "medium",
    customColor,
    children,
    style,
    ...props
}: ButtonProps): JSX.Element {
    const inlineStyle =
        variant === "custom" && customColor
            ? { ...style, backgroundColor: customColor }
            : style;

    return (
        <button
            className={`${styles.button} ${styles[variant]} ${styles[size]}`}
            style={inlineStyle}
            {...props}
        >
            {children}
        </button>
    );
}
