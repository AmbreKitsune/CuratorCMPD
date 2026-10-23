import styles from "./Header.module.css";

export default function Header({ title, subtitle }) {
  return (
    <header className={styles.Header}>
      <div className={styles.Container}>
        <span className={styles.HeaderTitle}>{title}</span>
        <span className={styles.HeaderDescription}>{subtitle}</span>
      </div>
    </header>
  );
}
