import { useEffect, useState } from "react";
import {
  CarFront,
  Radio,
  Shield,
  UserRound,
  UserRoundMinus,
  UsersRound,
} from "lucide-react";

import { UnitService as UnitQuery } from "../../../../../../services/query/UnitService";
import { OfficerService as OfficerCommand } from "../../../../../../services/command/OfficerService";
import { RealtimeService } from "../../../../../../services/RealtimeService";

import styles from "./Information.module.css";

const STATUSES = {
  on_base: "На базе",
  en_route: "В пути",
  on_patrol: "На патруле",
  responding: "Следует на вызов",
  on_scene: "На месте",
  returning: "Возвращается на базу",
  unavailable: "Недоступен",
};

export default function Information({ unit, vds }) {
  const [officers, setOfficers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [confirmId, setConfirmId] = useState(null);
  const [removingId, setRemovingId] = useState(null);

  useEffect(() => {
    let active = true;
    setOfficers([]);
    setLoading(true);
    setError("");
    setConfirmId(null);

    const load = async () => {
      try {
        const result = await UnitQuery.getOfficersUnit(unit.id);
        if (active) {
          setOfficers(result);
          setError("");
        }
      } catch (err) {
        if (active) setError(err.message || "Не удалось загрузить состав");
      } finally {
        if (active) setLoading(false);
      }
    };

    const unsubscribeUnits = RealtimeService.subscribe("units_update", load);
    const unsubscribeOfficers = RealtimeService.subscribe(
      "officers_update",
      load,
    );
    load();
    return () => {
      active = false;
      unsubscribeUnits();
      unsubscribeOfficers();
    };
  }, [unit.id]);

  const removeOfficer = async (officerId) => {
    setRemovingId(officerId);
    setError("");
    try {
      await OfficerCommand.unassign(officerId);
      setConfirmId(null);
      setOfficers((current) => current.filter((item) => item.id !== officerId));
    } catch (err) {
      setError(err.message || "Не удалось исключить сотрудника");
    } finally {
      setRemovingId(null);
    }
  };

  const canRemove = unit.status === "on_base";

  return (
    <div className={styles.Information}>
      <div className={styles.Identity}>
        <CarFront aria-hidden="true" />
        <div className={styles.ValueGroup}>
          <span className={styles.Label}>ЭКИПАЖ</span>
          <span className={styles.PrimaryValue}>{unit.name}</span>
        </div>
      </div>

      <div className={styles.Grid}>
        <div className={styles.Field}>
          <Radio aria-hidden="true" />
          <div className={styles.ValueGroup}>
            <span className={styles.Label}>ТИП</span>
            <span className={styles.Value}>{vds.vehicle_name}</span>
          </div>
        </div>
        <div className={styles.Field}>
          <Shield aria-hidden="true" />
          <div className={styles.ValueGroup}>
            <span className={styles.Label}>СОСТОЯНИЕ</span>
            <span className={styles.Value}>
              {STATUSES[unit.status] ?? unit.status}
            </span>
          </div>
        </div>
      </div>

      <section className={styles.Roster}>
        <div className={styles.RosterHeader}>
          <div className={styles.RosterTitle}>
            <UsersRound aria-hidden="true" />
            <span>СОСТАВ ЭКИПАЖА</span>
          </div>
          <span className={styles.Counter}>
            {officers.length} / {vds.capacity_officer}
          </span>
        </div>

        {error && (
          <div className={styles.Error} role="alert">
            {error}
          </div>
        )}
        {loading ? (
          <div className={styles.Empty}>Загрузка состава...</div>
        ) : officers.length === 0 ? (
          <div className={styles.Empty}>В экипаж пока никто не назначен</div>
        ) : (
          <div className={styles.List}>
            {officers.map((officer) => {
              const removing = removingId === officer.id;
              const allowed = canRemove && officer.status !== "duty";
              return (
                <div className={styles.Officer} key={officer.id}>
                  <div className={styles.Person}>
                    <div className={styles.Avatar}>
                      <UserRound aria-hidden="true" />
                    </div>
                    <div className={styles.ValueGroup}>
                      <span className={styles.PersonName}>
                        {officer.last_name} {officer.first_name}
                      </span>
                      <span className={styles.PersonMeta}>
                        Сотрудник №{String(officer.id).padStart(4, "0")}
                      </span>
                    </div>
                  </div>
                  {confirmId === officer.id ? (
                    <div className={styles.Actions}>
                      <button
                        type="button"
                        className={styles.Cancel}
                        onClick={() => setConfirmId(null)}
                        disabled={removing || !allowed}
                      >
                        Отмена
                      </button>
                      <button
                        type="button"
                        className={styles.Confirm}
                        onClick={() => removeOfficer(officer.id)}
                        disabled={removing || !allowed}
                      >
                        {removing ? "..." : "Исключить"}
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      className={styles.Remove}
                      onClick={() => setConfirmId(officer.id)}
                      disabled={!allowed || removingId !== null}
                      title={
                        allowed
                          ? "Исключить из экипажа"
                          : "Исключение доступно только на базе"
                      }
                      aria-label={`Исключить ${officer.last_name} ${officer.first_name} из экипажа`}
                    >
                      <UserRoundMinus aria-hidden="true" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
        <p className={styles.Hint}>
          Назначение сотрудников выполняется в разделе «Officers».
        </p>
      </section>
    </div>
  );
}
