import styles from "./List.module.css";

import UnitCard from "../Card/Card";

export default function UnitList({ units, vds }) {
  return (
    <div className={styles.List}>
      <div className={styles.Header}>
        <span>Экипажи · {units.length}</span>
      </div>

      <div className={styles.Unit}>
        {units.map((unit) => {
          const unitVDS = vds.find((item) => item.id === unit.vds_id);

          return (
            <UnitCard
              key={unit.id}
              id={unit.id}
              name={unit.name}
              code={unitVDS?.code ?? "—"}
            />
          );
        })}
      </div>
    </div>
  );
}
