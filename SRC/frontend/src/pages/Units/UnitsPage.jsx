import { useEffect, useState } from "react";
import { useOutletContext } from "react-router";

import { UnitService as UnitServiceQuery } from "../../services/query/UnitService";
import { RealtimeService } from "../../services/RealtimeService";

import Header from "../../components/Header/Header";
import styles from "./UnitsPage.module.css";

import List from "./Components/List/List";
import Dossier from "./Components/Dossier/Dossier";

export default function UnitPage() {
  const [unitsData, setUnitsData] = useState({
    units: [],
    vds: [],
  });

  useEffect(() => {
    const loader = async () => {
      const res = await UnitServiceQuery.getUnits();

      setUnitsData(res);
    };

    const unsubscribe = RealtimeService.subscribe("units_update", () => {
      loader();
    });

    loader();

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div className={styles.Main}>
      <Header
        title="Экипажи"
        subtitle="Формирование экипажей, контроль состояния и управление патрулированием."
      />

      <div className={styles.Container}>
        <List units={unitsData.units} vds={unitsData.vds} />
        <Dossier />
      </div>
    </div>
  );
}
