import { NavLink } from "react-router";
import {
  UserRound,
  UserRoundCheck,
  ShieldCheck,
  HeartPulse,
  Brain,
  UserRoundX,
  Skull,
  ChevronRight,
} from "lucide-react";

import styles from "./Card.module.css";

const STATUS_CONFIG = {
  reserve: { label: "В резерве", icon: UserRound, tone: "Neutral" },
  assigned: {
    label: "Назначен в экипаж",
    icon: UserRoundCheck,
    tone: "Assigned",
  },
  duty: { label: "На службе", icon: ShieldCheck, tone: "Duty" },
  treatment: { label: "На лечении", icon: HeartPulse, tone: "Warning" },
  therapy: { label: "На реабилитации", icon: Brain, tone: "Warning" },
  suspended: { label: "Отстранён", icon: UserRoundX, tone: "Danger" },
  dead: { label: "Погиб", icon: Skull, tone: "Dead" },
};

const DEFAULT_STATUS = {
  label: "Статус неизвестен",
  icon: UserRound,
  tone: "Neutral",
};

export default function OfficerCard({ id, first_name, last_name, status }) {
  const { label, icon: Icon, tone } = STATUS_CONFIG[status] ?? DEFAULT_STATUS;

  return (
    <NavLink
      to={`/officers/${id}`}
      className={({ isActive }) =>
        `${styles.Card} ${styles[tone]} ${isActive ? styles.Active : ""}`
      }
    >
      <div className={styles.Logo} aria-hidden="true">
        <Icon size={28} strokeWidth={1.8} />
      </div>

      <div className={styles.Information}>
        <div className={styles.Name}>
          <span>{last_name}</span>
          <span>{first_name}</span>
        </div>
        <span className={styles.Status}>{label}</span>
      </div>

      <ChevronRight
        className={styles.ChevronRight}
        size={20}
        aria-hidden="true"
      />
    </NavLink>
  );
}
