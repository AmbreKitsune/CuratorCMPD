import { useEffect, useState } from "react";
import { useParams } from "react-router";
import {
    CarFront,
    Radio,
    Shield,
    UsersRound,
    UserRound
} from "lucide-react";

import { UnitService as UnitServiceQuery }
    from "../../../../services/query/UnitService";

import { RealtimeService }
    from "../../../../services/RealtimeService";

import styles from "./Dossier.module.css";


const TYPE_LABELS = {
    patrol: "Патрульный экипаж"
};

const STATUS_LABELS = {
    on_base: "На базе",
    on_duty: "На службе",
    unavailable: "Недоступен"
};


export default function UnitDossier() {
    const { id } = useParams();

    const [unit, setUnit] = useState(null);
    const [officers, setOfficers] = useState([]);

    useEffect(() => {
        if (!id) {
            setUnit(null);
            setOfficers([]);
            return;
        }

        const loader = async () => {
            const unitResponse = await UnitServiceQuery.getUnit(id);
            const officersResponse =
                await UnitServiceQuery.getOfficersUnit(id);

            setUnit(unitResponse);
            setOfficers(officersResponse);
        };

        const unsubscribe = RealtimeService.subscribe(
            "units_update",
            loader
        );

        loader();

        return unsubscribe;
    }, [id]);

    if (!id) {
        return (
            <div className={styles.Dossier}>
                <div className={styles.Empty}>
                    <CarFront aria-hidden="true" />
                    <span>Выберите экипаж</span>
                    <small>
                        Информация об экипаже появится здесь
                    </small>
                </div>
            </div>
        );
    }

    if (!unit) {
        return (
            <div className={styles.Dossier}>
                <div className={styles.Empty}>
                    <span>Загрузка экипажа...</span>
                </div>
            </div>
        );
    }

    const type =
        TYPE_LABELS[unit.type] ?? unit.type;

    const status =
        STATUS_LABELS[unit.status] ?? unit.status;

    return (
        <div className={styles.Dossier}>
            <div className={styles.Content}>
                <div className={styles.Header}>
                    <div className={styles.HeaderInfo}>
                        <CarFront aria-hidden="true" />
                        <span>КАРТОЧКА ЭКИПАЖА</span>
                    </div>

                    <span className={styles.Code}>
                        {unit.code}
                    </span>
                </div>

                <div className={styles.Identity}>
                    <span className={styles.Eyebrow}>
                        ЭКИПАЖ
                    </span>

                    <span className={styles.UnitName}>
                        {unit.name}
                    </span>
                </div>

                <div className={styles.Stats}>
                    <div className={styles.Stat}>
                        <Radio aria-hidden="true" />

                        <div>
                            <span className={styles.Label}>
                                ТИП
                            </span>

                            <span className={styles.Value}>
                                {type}
                            </span>
                        </div>
                    </div>

                    <div className={styles.Stat}>
                        <Shield aria-hidden="true" />

                        <div>
                            <span className={styles.Label}>
                                СТАТУС
                            </span>

                            <span className={styles.Value}>
                                {status}
                            </span>
                        </div>
                    </div>

                    <div className={styles.Stat}>
                        <UsersRound aria-hidden="true" />

                        <div>
                            <span className={styles.Label}>
                                СОСТАВ
                            </span>

                            <span className={styles.Value}>
                                {officers.length} / {unit.max_personnel}
                            </span>
                        </div>
                    </div>
                </div>

                <div className={styles.Roster}>
                    <div className={styles.RosterHeader}>
                        <div>
                            <UsersRound aria-hidden="true" />
                            <span>СОСТАВ ЭКИПАЖА</span>
                        </div>

                        <span className={styles.Counter}>
                            {officers.length} сотрудника
                        </span>
                    </div>

                    {officers.length > 0 ? (
                        <div className={styles.OfficerList}>
                            {officers.map(officer => (
                                <div
                                    key={officer.id}
                                    className={styles.Officer}
                                >
                                    <div className={styles.OfficerIcon}>
                                        <UserRound aria-hidden="true" />
                                    </div>

                                    <div className={styles.OfficerInfo}>
                                        <span className={styles.OfficerName}>
                                            {officer.last_name}{" "}
                                            {officer.first_name}
                                        </span>

                                        <span className={styles.OfficerNumber}>
                                            Сотрудник №
                                            {String(officer.id).padStart(4, "0")}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className={styles.RosterEmpty}>
                            В экипаж пока никто не назначен
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
