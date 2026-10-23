import { useState } from "react";
import {
  ArrowRight,
  CircleCheck,
  Clock3,
  MapPinned,
  RotateCcw,
  ShieldAlert,
} from "lucide-react";

import { UnitService as UnitCommand } from "../../../../../../services/command/UnitService";
import styles from "./Management.module.css";

const STATUS = {
  on_base: "На базе",
  en_route: "В пути",
  on_patrol: "На патруле",
  responding: "Следует на вызов",
  on_scene: "На месте",
  returning: "Возвращается на базу",
  unavailable: "Недоступен",
};
const TARGET = { on_base: "На базе", on_patrol: "Патрулирование" };

export default function Management({ unit }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const canDispatch =
    unit.status === "on_base" && unit.target_state === "on_base";
  const canReturn =
    unit.target_state === "on_patrol" &&
    ["on_base", "on_patrol"].includes(unit.status);
  const pending =
    unit.status === "on_base" && unit.target_state === "on_patrol";
  const returning =
    unit.status === "returning" ||
    (unit.status === "on_patrol" && unit.target_state === "on_base");

  const sendOrder = async (target) => {
    setBusy(true);
    setError("");
    try {
      await UnitCommand.setTargetState(unit.id, target);
    } catch (err) {
      setError(err.message || "Не удалось отправить распоряжение");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={styles.Management}>
      <div className={styles.SectionHeading}>
        <MapPinned aria-hidden="true" />
        <div>
          <span className={styles.Eyebrow}>ОПЕРАТИВНОЕ УПРАВЛЕНИЕ</span>
          <h3 className={styles.Title}>Распоряжения экипажу</h3>
        </div>
      </div>

      <div className={styles.Overview}>
        <div className={styles.StatusBlock}>
          <span className={styles.Label}>ФАКТИЧЕСКОЕ СОСТОЯНИЕ</span>
          <strong className={styles.Value}>
            {STATUS[unit.status] ?? unit.status}
          </strong>
        </div>
        <ArrowRight aria-hidden="true" className={styles.Arrow} />
        <div className={styles.StatusBlock}>
          <span className={styles.Label}>РАСПОРЯЖЕНИЕ КУРАТОРА</span>
          <strong className={styles.Value}>
            {TARGET[unit.target_state] ?? unit.target_state}
          </strong>
        </div>
      </div>

      <div className={styles.Orders}>
        <button
          className={styles.Order}
          type="button"
          disabled={!canDispatch || busy}
          onClick={() => sendOrder("on_patrol")}
        >
          <span className={styles.OrderIcon}>
            <MapPinned aria-hidden="true" />
          </span>
          <span className={styles.OrderCopy}>
            <strong>Отправить на патруль</strong>
            <small>Дать экипажу приказ приступить к патрулированию</small>
          </span>
          <ArrowRight className={styles.OrderArrow} aria-hidden="true" />
        </button>

        <button
          className={styles.Order}
          type="button"
          disabled={!canReturn || busy}
          onClick={() => sendOrder("on_base")}
        >
          <span className={styles.OrderIcon}>
            <RotateCcw aria-hidden="true" />
          </span>
          <span className={styles.OrderCopy}>
            <strong>
              {unit.status === "on_base"
                ? "Отменить патрулирование"
                : "Вернуть на базу"}
            </strong>
            <small>
              {unit.status === "on_base"
                ? "Отменить ранее выданное распоряжение"
                : "Возвращение займёт около 10 секунд после обработки приказа"}
            </small>
          </span>
          <ArrowRight className={styles.OrderArrow} aria-hidden="true" />
        </button>
      </div>

      <div className={styles.Notice}>
        {returning ? (
          <Clock3 aria-hidden="true" />
        ) : pending ? (
          <Clock3 aria-hidden="true" />
        ) : unit.status === "on_base" ? (
          <CircleCheck aria-hidden="true" />
        ) : (
          <ShieldAlert aria-hidden="true" />
        )}
        <span>
          {returning
            ? "Экипаж возвращается на базу. Сотрудники останутся на службе до прибытия."
            : pending
              ? "Приказ отправлен. Ожидаем обработки сервисом экипажей."
              : unit.status === "on_base"
                ? "Экипаж находится на базе. Для отправки нужен назначенный состав со статусом ASSIGNED."
                : unit.status === "on_patrol"
                  ? "Экипаж выполняет патрулирование. Можно приказать вернуться на базу."
                  : "Для текущего состояния экипажа распоряжения пока недоступны."}
        </span>
      </div>
      {error && (
        <div className={styles.Error} role="alert">
          {error}
        </div>
      )}
    </div>
  );
}
