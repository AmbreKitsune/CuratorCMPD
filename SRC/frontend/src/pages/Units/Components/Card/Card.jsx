import { NavLink } from "react-router";
import { Car, ChevronRight } from "lucide-react";

import styles from "./Card.module.css";

export default function UnitCard({ id, name, code }) {
  return (
    <NavLink
      to={`/units/${id}`}
      className={({ isActive }) =>
        `${styles.Card} ${isActive ? styles.Active : ""}`
      }
    >
      <div className={styles.Logo}>
        <Car size={32} />
      </div>

      <div className={styles.Information}>
        <div className={styles.Title}>
          <span>{name}</span>
        </div>

        <span className={styles.Description}>{code}</span>
      </div>

      <div className={styles.ChevronRight}>
        <ChevronRight />
      </div>
    </NavLink>
  );
}
