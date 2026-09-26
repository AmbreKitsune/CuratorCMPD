import {
    UserRound,
    CalendarDays,
    Briefcase,
    UsersRound
} from "lucide-react";

import styles from "./Information.module.css";


export default function Information({ officer }) {
    if (!officer) return null;

    const unitName = officer.assigned_unit_id
        ? `Экипаж №${officer.assigned_unit_id}`
        : "Не назначен";

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
                        <span className={styles.Value}>
                            {officer.age} лет
                        </span>
                    </div>
                </div>

                <div className={styles.Field}>
                    <Briefcase aria-hidden="true" />

                    <div className={styles.ValueGroup}>
                        <span className={styles.Label}>ОПЫТ</span>
                        <span className={styles.Value}>
                            {officer.experience} лет
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
