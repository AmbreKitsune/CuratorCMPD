import styles from "./NotFoundPage.module.css";

export default function NotFoundPage() {
  return (
    <div className={styles.Main}>
      <div className={styles.Title}>
        <h1>Ошибка 404</h1>
        <span>!Страница не найдена!</span>
      </div>
    </div>
  );
}
