import { useEffect, useState } from "react";
import {
    Shield,
    UsersRound,
    UserPlus,
    UserMinus
} from "lucide-react";

import { UnitService as UnitServiceQuery } from "../../../../../../services/query/UnitService";
import { OfficerService as OfficerServiceCommand  } from "../../../../../../services/command/OfficerService";

import styles from "./Management.module.css";


export default function Management({ officer }) {
    const [units, setUnits] = useState([]);
    const [selectedUnitId, setSelectedUnitId] = useState("");
    const [error, setError] = useState(null);

    useEffect(() => {
        const loader = async () => {
            try {
                const response = await UnitServiceQuery.getUnits();
                setUnits(response);
            } catch (error) {
                setError(error.message);
            }
        };

        loader();
    }, []);

    useEffect(() => {
        setSelectedUnitId(
            officer.assigned_unit_id
                ? String(officer.assigned_unit_id)
                : ""
        );
    }, [officer.id, officer.assigned_unit_id]);

    const currentUnit = units.find(
        unit => unit.id === officer.assigned_unit_id
    );

    const isSameUnit =
        selectedUnitId === String(officer.assigned_unit_id);

    const handleAssign = async () => {
        await OfficerServiceCommand.assign(officer.id, selectedUnitId)
    };

    const handleUnassign = async () => {
        await OfficerServiceCommand.unassign(officer.id)
    };

    return (
        <div className={styles.Management}>
            <div className={styles.Header}>
                <Shield aria-hidden="true" />

                <div>
                    <span className={styles.Title}>
                        УПРАВЛЕНИЕ СОТРУДНИКОМ
                    </span>

                    <span className={styles.Description}>
                        Назначение и перевод между экипажами
                    </span>
                </div>
            </div>

            <div className={styles.Current}>
                <UsersRound aria-hidden="true" />

                <div className={styles.ValueGroup}>
                    <span className={styles.Label}>
                        ТЕКУЩИЙ ЭКИПАЖ
                    </span>

                    <span className={styles.Value}>
                        {currentUnit
                            ? `${currentUnit.name} · ${currentUnit.code}`
                            : officer.assigned_unit_id
                                ? `Экипаж №${officer.assigned_unit_id}`
                                : "Не назначен"
                        }
                    </span>
                </div>
            </div>

            <div className={styles.Control}>
                <label
                    className={styles.Label}
                    htmlFor="officer-unit"
                >
                    ВЫБЕРИТЕ ЭКИПАЖ
                </label>

                <div className={styles.ActionRow}>
                    <select
                        id="officer-unit"
                        className={styles.Select}
                        value={selectedUnitId}
                        onChange={event =>
                            setSelectedUnitId(event.target.value)
                        }
                    >
                        <option value="">
                            Выберите экипаж
                        </option>

                        {units.map(unit => (
                            <option
                                key={unit.id}
                                value={unit.id}
                            >
                                {unit.name} · {unit.code}
                            </option>
                        ))}
                    </select>

                    <button
                        type="button"
                        className={styles.AssignButton}
                        disabled={!selectedUnitId || isSameUnit}
                        onClick={handleAssign}
                    >
                        <UserPlus aria-hidden="true" />
                        {officer.assigned_unit_id
                            ? "Перевести"
                            : "Назначить"
                        }
                    </button>
                </div>

                {officer.assigned_unit_id && (
                    <button
                        type="button"
                        className={styles.UnassignButton}
                        onClick={handleUnassign}
                    >
                        <UserMinus aria-hidden="true" />
                        Снять с экипажа
                    </button>
                )}

                {error && (
                    <span className={styles.Error}>
                        {error}
                    </span>
                )}
            </div>
        </div>
    );
}
