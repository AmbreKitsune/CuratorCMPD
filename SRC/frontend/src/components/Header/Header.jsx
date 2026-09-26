import styles from "./Header.module.css";

export default function Header({title, subtitle}) {
    return (
        <header className={styles.header}>
            <span className={styles.headerTitle}>{title}</span>
        </header>
    )
}
