import {
  UserRound,
  CalendarDays,
  Briefcase,
  UsersRound,
  ShieldCheck,
  HeartPulse,
} from "lucide-react";

import styles from "./Information.module.css";

const STATUS_LABELS = {
  reserve: "В резерве",
  assigned: "Назначен в экипаж",
  duty: "На службе",
  treatment: "На лечении",
  therapy: "На реабилитации",
  suspended: "Отстранён",
  dead: "Погиб",
};

const HEALTH_LABELS = {
  healthy: "Здоров",
  wounded: "Ранен",
  psychosis: "Психологические нарушения",
  dead: "Погиб",
};

const STATUS_TONES = {
  reserve: "Neutral",
  assigned: "Positive",
  duty: "Positive",
  treatment: "Warning",
  therapy: "Warning",
  suspended: "Danger",
  dead: "Danger",
};

const HEALTH_TONES = {
  healthy: "Positive",
  wounded: "Warning",
  psychosis: "Warning",
  dead: "Danger",
};

export default function Information({ officer }) {
  if (!officer) return null;

  const unitName = officer.assigned_unit_id
    ? `Экипаж №${officer.assigned_unit_id}`
    : "Не назначен";

  const statusLabel = STATUS_LABELS[officer.status] ?? "Неизвестен";
  const healthLabel = HEALTH_LABELS[officer.health] ?? "Нет данных";
  const statusTone = STATUS_TONES[officer.status] ?? "Neutral";
  const healthTone = HEALTH_TONES[officer.health] ?? "Neutral";

  return (
    <div className={styles.Information}>
      <div className={styles.Identity}>
        <UserRound aria-hidden="true" />
        <div className={styles.ValueGroup}>
          <span className={styles.Label}>СОТРУДНИК</span>
          <span className={styles.PrimaryValue}>
            {officer.last_name} {officer.first_name}
          </span>
        </div>
      </div>

      <div className={styles.Grid}>
        <div className={styles.Field}>
          <CalendarDays aria-hidden="true" />
          <div className={styles.ValueGroup}>
            <span className={styles.Label}>ВОЗРАСТ</span>
            <span className={styles.Value}>{officer.age} лет</span>
          </div>
        </div>
        <div className={styles.Field}>
          <Briefcase aria-hidden="true" />
          <div className={styles.ValueGroup}>
            <span className={styles.Label}>ОПЫТ</span>
            <span className={styles.Value}>{officer.experience} лет</span>
          </div>
        </div>
      </div>

      <div className={styles.Grid}>
        <div className={styles.Field}>
          <ShieldCheck aria-hidden="true" />
          <div className={styles.ValueGroup}>
            <span className={styles.Label}>СЛУЖЕБНЫЙ СТАТУС</span>
            <span className={`${styles.Value} ${styles[statusTone]}`}>
              {statusLabel}
            </span>
          </div>
        </div>
        <div className={styles.Field}>
          <HeartPulse aria-hidden="true" />
          <div className={styles.ValueGroup}>
            <span className={styles.Label}>СОСТОЯНИЕ ЗДОРОВЬЯ</span>
            <span className={`${styles.Value} ${styles[healthTone]}`}>
              {healthLabel}
            </span>
          </div>
        </div>
      </div>

      <div className={styles.Assignment}>
        <UsersRound aria-hidden="true" />
        <div className={styles.ValueGroup}>
          <span className={styles.Label}>ТЕКУЩИЙ ЭКИПАЖ</span>
          <span
            className={`${styles.Value} ${
              !officer.assigned_unit_id ? styles.Muted : ""
            }`}
          >
            {unitName}
          </span>
        </div>
      </div>
    </div>
  );
}
