import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { FileText, UserRound } from "lucide-react";

import Information from "./Tabs/Information/Information";
import Management from "./Tabs/Management/Management";

import { OfficerService as OfficerServiceQuery } from "../../../../services/query/OfficerService";

import { RealtimeService } from "../../../../services/RealtimeService";

import styles from "./Dossier.module.css";

const TABS = [
  {
    title: "ИНФОРМАЦИЯ",
    tag: "information",
  },
  {
    title: "УПРАВЛЕНИЕ",
    tag: "management",
  },
];

export default function OfficerDossier() {
  const { id } = useParams();

  const [officer, setOfficer] = useState(null);
  const [activeTab, setActiveTab] = useState("information");

  useEffect(() => {
    if (!id) {
      setOfficer(null);
      return;
    }

    const loader = async () => {
      const response = await OfficerServiceQuery.getOfficer(id);

      setOfficer(response);
    };

    const unsubscribe = RealtimeService.subscribe("officers_update", loader);

    loader();

    return unsubscribe;
  }, [id]);

  if (!id) {
    return (
      <div className={styles.Dossier}>
        <div className={styles.Empty}>
          <UserRound aria-hidden="true" />

          <span>Выберите сотрудника</span>

          <small>Информация и управление появятся здесь</small>
        </div>
      </div>
    );
  }

  if (!officer) {
    return (
      <div className={styles.Dossier}>
        <div className={styles.Empty}>
          <span>Загрузка сотрудника...</span>
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

            <span>
              ДОСЬЕ · {officer.last_name} {officer.first_name[0]}.
            </span>
          </div>

          <span className={styles.CaseNumber}>
            Дело сотрудника №{String(officer.id).padStart(4, "0")}
          </span>
        </div>

        <div className={styles.Main}>
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
              {activeTab === "information" && <Information officer={officer} />}

              {activeTab === "management" && <Management officer={officer} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
