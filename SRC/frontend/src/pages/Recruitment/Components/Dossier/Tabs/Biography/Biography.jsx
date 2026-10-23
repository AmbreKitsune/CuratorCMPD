import styles from "./Biography.module.css";

const EDUCATION = {
  institution: "Полицейская академия Лос-Сантоса",
  level: "Профессиональная подготовка МВД",
};

export default function Biography({ candidate }) {
  if (!candidate) return null;

  const fullName = [candidate.last_name, candidate.first_name]
    .filter(Boolean)
    .join(" ");

  const experience = Number(candidate.experience) || 0;

  return (
    <section className={styles.Biography} aria-label="Биография кандидата">
      <div className={styles.Section}>
        <h3 className={styles.Title}>Основные сведения</h3>
        <dl className={styles.Details}>
          <div className={styles.Row}>
            <dt>ФИО</dt>
            <dd>{fullName || "Не указано"}</dd>
          </div>
          <div className={styles.Row}>
            <dt>Возраст</dt>
            <dd>
              {candidate.age != null ? `${candidate.age} лет` : "Не указан"}
            </dd>
          </div>
          <div className={styles.Row}>
            <dt>Опыт службы</dt>
            <dd>{experience === 0 ? "Без опыта" : `${experience} лет`}</dd>
          </div>
        </dl>
      </div>

      <div className={styles.Section}>
        <h3 className={styles.Title}>Образование</h3>
        <dl className={styles.Details}>
          <div className={styles.Row}>
            <dt>Учебное заведение</dt>
            <dd>{EDUCATION.institution}</dd>
          </div>
          <div className={styles.Row}>
            <dt>Подготовка</dt>
            <dd>{EDUCATION.level}</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
