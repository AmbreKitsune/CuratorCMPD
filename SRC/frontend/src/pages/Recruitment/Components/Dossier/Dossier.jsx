import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { FileText, UserRoundCheck, Ban, ShieldUser } from "lucide-react";

import { CandidateService as CandidateServiceQuery } from "../../../../services/query/CandidateService";
import { RealtimeService } from "../../../../services/RealtimeService";

import Biography from "./Tabs/Biography/Biography";
import Management from "./Tabs/Management/Management";
import Skills from "./Tabs/Skills/Skills";
import Medical from "./Tabs/Medical/Medical";

import styles from "./Dossier.module.css";

const TABS = [
  {
    title: "Биография",
    tag: "biography",
  },
  {
    title: "Навыки",
    tag: "skills",
  },
  {
    title: "Мед. заключение",
    tag: "medical",
  },
  {
    title: "Вердикт",
    tag: "management",
  },
];

export default function CandidateDossier() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("biography");
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setCandidate(null);
    let active = true;

    if (!id) {
      return;
    }

    const loader = async () => {
      try {
        const response = await CandidateServiceQuery.getCandidate(id);

        if (active) {
          setCandidate(response);
          setActiveTab("biography");
        }
      } catch {}

      if (active) {
        setLoading(false);
      }
    };

    const unsubscribe = RealtimeService.subscribe("candidates_update", () => {
      navigate("/recruitment");
    });

    loader();

    return () => {
      active = false;
      unsubscribe();
    };
  }, [id]);

  if (!id) {
    return (
      <div className={styles.Dossier}>
        <div className={styles.Empty}>
          <FileText aria-hidden="true" />

          <span>Выберите кандидата</span>

          <small>Досье кандидата появится здесь</small>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={styles.Dossier}>
        <div className={styles.Empty}>
          <span>Загрузка кандидата...</span>
        </div>
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className={styles.Dossier}>
        <div className={styles.Empty}>
          <span>Кандидат не найден!</span>
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
            Дело №{String(candidate.id).padStart(4, "0")}
          </span>
        </div>

        <div className={styles.Main}>
          <div className={styles.Watermark} aria-hidden="true">
            <ShieldUser strokeWidth={1} />
            <span>Отдел набора кадров</span>
          </div>

          <div className={styles.Profile}>
            <div className={styles.Tabs} role="tablist">
              {TABS.map((item) => (
                <button
                  key={item.tag}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === item.tag}
                  className={
                    activeTab === item.tag ? styles.ActiveTab : styles.Tab
                  }
                  onClick={() => setActiveTab(item.tag)}
                >
                  {item.title}
                </button>
              ))}
            </div>

            <div className={styles.TabContent}>
              {activeTab === "biography" && <Biography candidate={candidate} />}

              {activeTab === "skills" && <Skills />}
              {activeTab === "medical" && <Medical />}

              {activeTab === "management" && (
                <Management candidate={candidate} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
