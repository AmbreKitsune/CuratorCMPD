import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
    FileText,
    UserRoundCheck,
    Ban,
    ShieldUser
} from "lucide-react";

import { CandidateService as CandidateServiceQuery }
    from "../../../../services/query/CandidateService";

import { CandidateService as CandidateServiceCommand }
    from "../../../../services/command/CandidateService";

import { RealtimeService }
    from "../../../../services/RealtimeService";

import styles from "./Dossier.module.css";


export default function CandidateDossier() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [isAccepting, setIsAccepting] = useState(false);
    const [candidate, setCandidate] = useState(null);

    useEffect(() => {
        if (!id) {
            setCandidate(null);
            return;
        }

        const loader = async () => {
            const response =
                await CandidateServiceQuery.getCandidate(id);

            setCandidate(response);
        };

        const unsubscribe = RealtimeService.subscribe(
            "candidates_update",
            () => {
                navigate("/recruitment");
            }
        );

        loader();

        return unsubscribe;
    }, [id]);

    const BtnAction = async () => {
        if (isAccepting) return;

        setIsAccepting(true);

        try {
            await CandidateServiceCommand.accept(id);
            navigate("/recruitment");
        } finally {
            setIsAccepting(false);
        }
    };

    if (!id) {
        return (
            <div className={styles.Dossier}>
                <div className={styles.Empty}>
                    <FileText aria-hidden="true" />

                    <span>Выберите кандидата</span>

                    <small>
                        Досье кандидата появится здесь
                    </small>
                </div>
            </div>
        );
    }

    if (!candidate) {
        return (
            <div className={styles.Dossier}>
                <div className={styles.Empty}>
                    <span>Загрузка кандидата...</span>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.Dossier}>
            <div className={styles.Content}>
                <div className={styles.Header}>
                    <div className={styles.HeaderInfo}>
                        <FileText size={32} />
                        <span>ДОСЬЕ КАНДИДАТА</span>
                    </div>

                    <span className={styles.CaseNumber}>
                        Дело №
                        {String(candidate.id).padStart(4, "0")}
                    </span>
                </div>

                <div className={styles.Main}>
                    <div
                        className={styles.Watermark}
                        aria-hidden="true"
                    >
                        <ShieldUser strokeWidth={1} />
                        <span>Отдел набора кадров</span>
                    </div>

                    <div className={styles.Card}>
                        <div className={styles.CardName}>
                            <span>
                                {candidate.last_name}{" "}
                                {candidate.first_name}
                            </span>
                        </div>

                        <div className={styles.Information}>
                            <span className={styles.InformationTitle}>
                                ОСНОВНЫЕ СВЕДЕНИЯ
                            </span>

                            <div className={styles.InfoList}>
                                <div className={styles.InfoRow}>
                                    <span className={styles.InfoTitle}>
                                        Возраст
                                    </span>

                                    <span className={styles.InfoDesc}>
                                        {candidate.age} лет
                                    </span>
                                </div>

                                <div className={styles.InfoRow}>
                                    <span className={styles.InfoTitle}>
                                        Опыт
                                    </span>

                                    <span className={styles.InfoDesc}>
                                        {candidate.experience} лет
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.Footer}>
                    <button
                        type="button"
                        className={styles.BtnAccept}
                        onClick={BtnAction}
                        disabled={!candidate || isAccepting}
                    >
                        {!candidate
                            ? <Ban size={30} />
                            : <UserRoundCheck size={30} />
                        }

                        {!candidate
                            ? "Операция недоступна"
                            : isAccepting
                                ? "Принимаем..."
                                : "Принять на работу"
                        }
                    </button>
                </div>
            </div>
        </div>
    );
}
