import styles from "./dot-spinner.module.css";

export default function DotSpinner({ className = "" }: { className?: string }) {
    return (
        <span aria-hidden="true" className={`${styles.spinner} shrink-0 ${className}`}>
            {Array.from({ length: 8 }, (_, index) => (
                <span key={index} className={styles.dot} />
            ))}
        </span>
    );
}
