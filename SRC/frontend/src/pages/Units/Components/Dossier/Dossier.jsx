import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { CarFront } from "lucide-react";

import { UnitService as UnitServiceQuery } from "../../../../services/query/UnitService";
import { RealtimeService } from "../../../../services/RealtimeService";

import Information from "./Tabs/Information/Information";
import Management from "./Tabs/Management/Management";

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

export default function UnitDossier() {
  const { id } = useParams();

  const [unitData, setUnitData] = useState(null);

  const [activeTab, setActiveTab] = useState("information");

  useEffect(() => {
    if (!id) {
      setUnitData(null);
      return;
    }

    const loader = async () => {
      const unitResponse = await UnitServiceQuery.getUnit(id);

      setUnitData(unitResponse);
    };

    const unsubscribe = RealtimeService.subscribe("units_update", loader);

    loader();

    return unsubscribe;
  }, [id]);

  if (!id) {
    return (
      <div className={styles.Dossier}>
        <div className={styles.Empty}>
          <CarFront aria-hidden="true" />
          <span>Выберите экипаж</span>
          <small>Информация об экипаже появится здесь</small>
        </div>
      </div>
    );
  }

  if (!unitData) {
    return (
      <div className={styles.Dossier}>
        <div className={styles.Empty}>
          <span>Загрузка экипажа...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.Dossier}>
      <div className={styles.Content}>
        <div className={styles.Header}>
          <div className={styles.HeaderInfo}>
            <CarFront aria-hidden="true" />
            <span>КАРТОЧКА ЭКИПАЖА</span>
          </div>

          <span className={styles.Code}>
            {unitData.unit.name} ● {unitData.vds.code}
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
              {activeTab === "information" && (
                <Information unit={unitData.unit} vds={unitData.vds} />
              )}

              {activeTab === "management" && (
                <Management unit={unitData.unit} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
