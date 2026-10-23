import { useEffect, useMemo, useState } from "react";
import { useOutletContext } from "react-router";
import {
  Activity,
  CarFront,
  Clock3,
  MapPinned,
  ShieldCheck,
  UserRoundPlus,
  UsersRound,
  Warehouse,
  ArrowLeftRight,
} from "lucide-react";

import Header from "../../components/Header/Header";
import { OfficerService } from "../../services/query/OfficerService";
import { UnitService } from "../../services/query/UnitService";
import { CandidateService } from "../../services/query/CandidateService";
import { RealtimeService } from "../../services/RealtimeService";
import styles from "./Home.module.css";

const PHASES = {
  ACTIVE: { label: "Смена активна", tone: "active" },
  AVAILABLE: { label: "Ожидание смены", tone: "waiting" },
  RESTING: { label: "Вне службы", tone: "waiting" },
  SIGNED_OFF: { label: "Смена завершена", tone: "waiting" },
};

const OFFICER_STATUS = {
  reserve: "Резерв",
  assigned: "Назначены",
  duty: "На службе",
  treatment: "На лечении",
  therapy: "На терапии",
  suspended: "Отстранены",
  dead: "Погибли",
};

const UNIT_STATUS = {
  on_base: "На базе",
  on_patrol: "На патруле",
  returning: "Возвращаются",
  en_route: "В пути",
  responding: "Следуют на вызов",
  on_scene: "На месте вызова",
  unavailable: "Недоступны",
};

function formatTime(value) {
  const minutes = Number.isFinite(value) ? value : 540;
  return `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
}

function getCounts(items, status) {
  return items.reduce((result, item) => {
    const key = item[status];
    result[key] = (result[key] ?? 0) + 1;
    return result;
  }, {});
}

function Metric({ icon: Icon, label, value, hint }) {
  return (
    <article className={styles.Metric}>
      <div className={styles.MetricIcon}>
        <Icon size={19} aria-hidden="true" />
      </div>
      <span className={styles.MetricLabel}>{label}</span>
      <strong className={styles.MetricValue}>{value}</strong>
      <span className={styles.MetricHint}>{hint}</span>
    </article>
  );
}

function Distribution({ title, icon: Icon, items, total, labels, colorClass }) {
  const entries = Object.entries(labels).map(([key, label]) => ({
    key,
    label,
    value: items[key] ?? 0,
  }));

  return (
    <section className={styles.Panel}>
      <div className={styles.PanelHead}>
        <div className={styles.PanelTitle}>
          <Icon size={19} aria-hidden="true" />
          <h2>{title}</h2>
        </div>
        <span className={styles.PanelTotal}>{total} всего</span>
      </div>
      <div className={styles.DistributionTrack} aria-label={`Всего: ${total}`}>
        {entries
          .map(({ key, value }, i) => ({ key, value, i }))
          .filter(({ value }) => value > 0)
          .map(({ key, value, i }) => (
            <div
              key={key}
              className={`${styles.DistributionSegment} ${colorClass[i % colorClass.length]}`}
              style={{ width: `${(value / Math.max(total, 1)) * 100}%` }}
              title={`${labels[key]}: ${value}`}
            />
          ))}
      </div>
      <div className={styles.Rows}>
        {entries.map(({ key, label, value }) => (
          <div className={styles.DataRow} key={key}>
            <span className={styles.RowLabel}>{label}</span>
            <strong className={styles.RowValue}>{value}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function Home() {
  const { ShiftInfo } = useOutletContext() ?? {};
  const [officers, setOfficers] = useState([]);
  const [units, setUnits] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    let alive = true;

    const loadOfficers = async () => {
      try {
        const data = await OfficerService.getOfficers();
        if (alive) {
          setOfficers(Array.isArray(data) ? data : []);
          setErrors((e) => ({ ...e, officers: false }));
        }
      } catch (e) {
        if (alive) setErrors((prev) => ({ ...prev, officers: true }));
      }
    };
    const loadUnits = async () => {
      try {
        const data = await UnitService.getUnits();
        if (alive) {
          setUnits(Array.isArray(data?.units) ? data.units : []);
          setErrors((e) => ({ ...e, units: false }));
        }
      } catch (e) {
        if (alive) setErrors((prev) => ({ ...prev, units: true }));
      }
    };
    const loadCandidates = async () => {
      try {
        const data = await CandidateService.getCandidates();
        if (alive) {
          setCandidates(Array.isArray(data) ? data : []);
          setErrors((e) => ({ ...e, candidates: false }));
        }
      } catch (e) {
        if (alive) setErrors((prev) => ({ ...prev, candidates: true }));
      }
    };

    void loadOfficers();
    void loadUnits();
    void loadCandidates();

    const unsubscribers = [
      RealtimeService.subscribe("officers_update", loadOfficers),
      RealtimeService.subscribe("units_update", loadUnits),
      RealtimeService.subscribe("candidates_update", loadCandidates),
    ];
    return () => {
      alive = false;
      unsubscribers.forEach((unsubscribe) => unsubscribe());
    };
  }, []);

  const officerCounts = useMemo(
    () => getCounts(officers, "status"),
    [officers],
  );
  const unitCounts = useMemo(() => getCounts(units, "status"), [units]);
  const phase = PHASES[ShiftInfo?.phase] ?? {
    label: "Загрузка смены",
    tone: "waiting",
  };
  const shiftType =
    ShiftInfo?.type === "NIGHT" ? "Ночная смена" : "Дневная смена";
  const onDuty = officerCounts.duty ?? 0;
  const inField = units.length - (unitCounts.on_base ?? 0);
  const hasError = Object.values(errors).some(Boolean);

  return (
    <div className={styles.Main}>
      <Header
        title="Обзор ведомства"
        subtitle="Оперативная сводка по личному составу и экипажам."
      />

      <div className={styles.Content}>
        {hasError && (
          <div className={styles.Error} role="status">
            Часть показателей недоступна. Данные обновятся при следующем событии
            системы.
          </div>
        )}

        <div className={styles.Metrics}>
          <Metric
            icon={UsersRound}
            label="Личный состав"
            value={errors.officers ? "—" : officers.length}
            hint="Сотрудников в ведомстве"
          />
          <Metric
            icon={CarFront}
            label="Экипажи"
            value={errors.units ? "—" : units.length}
            hint="Зарегистрировано"
          />
          <Metric
            icon={MapPinned}
            label="На патруле"
            value={errors.units ? "—" : (unitCounts.on_patrol ?? 0)}
            hint="Выполняют патрулирование"
          />
          <Metric
            icon={UserRoundPlus}
            label="Кандидаты"
            value={errors.candidates ? "—" : candidates.length}
            hint="Ожидают рассмотрения"
          />
        </div>

        <section className={styles.ShiftPanel}>
          <div className={styles.ShiftInfo}>
            <div className={styles.Eyebrow}>
              <Activity size={15} aria-hidden="true" /> ТЕКУЩАЯ СМЕНА
            </div>
            <div className={styles.ShiftTitleRow}>
              <h2>{shiftType}</h2>
              <span
                className={`${styles.Phase} ${phase.tone === "active" ? styles.PhaseActive : styles.PhaseWaiting}`}
              >
                <span className={styles.PhaseDot} /> {phase.label}
              </span>
            </div>
            <p>Состояние ведомства на текущее игровое время.</p>
          </div>
          <div className={styles.ShiftFacts}>
            <div className={styles.ShiftFact}>
              <Clock3 size={18} aria-hidden="true" />
              <div>
                <small>Игровое время</small>
                <strong>{formatTime(ShiftInfo?.time)}</strong>
              </div>
            </div>
            <div className={styles.ShiftFact}>
              <ShieldCheck size={18} aria-hidden="true" />
              <div>
                <small>На службе</small>
                <strong>
                  {errors.officers ? "—" : `${onDuty} / ${officers.length}`}
                </strong>
              </div>
            </div>
            <div className={styles.ShiftFact}>
              <ArrowLeftRight size={18} aria-hidden="true" />
              <div>
                <small>Вне базы</small>
                <strong>{errors.units ? "—" : inField}</strong>
              </div>
            </div>
          </div>
        </section>

        <div className={styles.DetailsGrid}>
          <Distribution
            title="Состояние экипажей"
            icon={Warehouse}
            items={unitCounts}
            total={errors.units ? "—" : units.length}
            labels={UNIT_STATUS}
            colorClass={[
              styles.ColorBlue,
              styles.ColorGreen,
              styles.ColorAmber,
              styles.ColorSlate,
            ]}
          />
          <Distribution
            title="Личный состав"
            icon={UsersRound}
            items={officerCounts}
            total={errors.officers ? "—" : officers.length}
            labels={OFFICER_STATUS}
            colorClass={[
              styles.ColorSlate,
              styles.ColorBlue,
              styles.ColorGreen,
              styles.ColorAmber,
            ]}
          />
        </div>
        <p className={styles.Footnote}>
          Показатели отражают текущие данные ведомства и обновляются при
          изменениях в системе.
        </p>
      </div>
    </div>
  );
}
