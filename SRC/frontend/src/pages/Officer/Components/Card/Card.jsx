import { NavLink } from "react-router";
import { User, ChevronRight } from "lucide-react";

import styles from "./Card.module.css";


export default function OfficerCard({ id, first_name, last_name, age }) {

    return (
        <NavLink
            to={`/officers/${id}`}
            className={({ isActive }) =>
                `${styles.Card} ${isActive ? styles.Active : ""}`
            }
        >
            <div className={styles.Logo}>
                <User size={32}/>
            </div>

            <div className={styles.Information}>
                <div className={styles.Name}>
                    <span>{last_name}</span>
                    <span>{first_name}</span>
                </div>

                <span className={styles.Age}>Возраст: {age}</span>
            </div>

            <div className={styles.ChevronRight}>
                <ChevronRight/>
            </div>
        </NavLink>
    )
}
