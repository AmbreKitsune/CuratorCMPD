import styles from "./List.module.css";

import OfficerCard from "../Card/Card";

export default function OfficerList({ officers }) {
  return (
    <div className={styles.List}>
      <div className={styles.Header}>
        <span>ОФИЦЕРЫ · {officers.length}</span>
      </div>

      <div className={styles.Officer}>
        {officers.map((item) => (
          <OfficerCard
            key={item.id}
            id={item.id}
            first_name={item.first_name}
            last_name={item.last_name}
            status={item.status}
            assigned_unit_id={item.assigned_unit_id}
          />
        ))}
      </div>
    </div>
  );
}
