import { useState } from "react";
import { useNavigate } from "react-router";
import { CheckCircle2, XCircle } from "lucide-react";

import { CandidateService as CandidateServiceCommand } from "../../../../../../services/command/CandidateService";

import styles from "./Management.module.css";

export default function Management({ candidate }) {
  const navigate = useNavigate();
  const [isAccepting, setIsAccepting] = useState(false);
  const [error, setError] = useState("");

  if (!candidate) return null;

  const acceptCandidate = async () => {
    if (isAccepting) return;

    setIsAccepting(true);
    setError("");

    try {
      await CandidateServiceCommand.accept(candidate.id);
      navigate("/recruitment");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Не удалось принять кандидата.",
      );
    } finally {
      setIsAccepting(false);
    }
  };

  return (
    <section className={styles.Management} aria-label="Решение по кандидату">
      <div className={styles.Section}>
        <h3 className={styles.Title}>Принять на службу</h3>
        <p className={styles.Description}>
          Кандидат будет добавлен в список сотрудников без назначения в экипаж.
        </p>
        <button
          type="button"
          className={styles.AcceptButton}
          onClick={acceptCandidate}
          disabled={isAccepting}
        >
          <CheckCircle2 size={18} aria-hidden="true" />
          {isAccepting ? "Принимаем..." : "Принять кандидата"}
        </button>
      </div>

      <div className={styles.Section}>
        <h3 className={styles.Title}>Отклонить кандидатуру</h3>
        <p className={styles.Description}>
          Отказ станет доступен после подключения соответствующего действия.
        </p>
        <button type="button" className={styles.RejectButton} disabled>
          <XCircle size={18} aria-hidden="true" />
          Отклонить кандидата
        </button>
      </div>

      {error && (
        <p className={styles.Error} role="alert">
          {error}
        </p>
      )}
    </section>
  );
}
