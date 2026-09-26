import styles from "./List.module.css";


import UnitCard from "../Card/Card";


export default function UnitList({ units }) {
    return (
        <div className={styles.List}>
            <div className={styles.Header}>
                <span>Экипажи · {units.length}</span>
            </div>

            <div className={styles.Unit}>
                {
                    units.map((item) => (
                        <UnitCard
                            key={item.id}
                            id={item.id}
                            name={item.name}
                            code={item.code}
                        />
                    ))
                }
            </div>

        </div>
    )
}
