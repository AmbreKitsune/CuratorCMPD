import { useEffect, useState } from "react";

import { OfficerService as OfficerServiceQuery } from "../../services/query/OfficerService";
import { RealtimeService } from "../../services/RealtimeService";

import Header from "../../components/Header/Header";
import styles from "./OfficerPage.module.css";

import List from "./Components/List/List";
import Dossier from "./Components/Dossier/Dossier";

export default function OfficerPage() {
  const [officers, setOfficers] = useState([]);

  useEffect(() => {
    const loader = async () => {
      const res = await OfficerServiceQuery.getOfficers();
      setOfficers(res);
    };

    const unsubscribe = RealtimeService.subscribe("officers_update", () => {
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
        title="Личный состав"
        subtitle="Управление сотрудниками ведомства, их назначениями и распределением по экипажам."
      />

      <div className={styles.Container}>
        <List officers={officers} />
        <Dossier />
      </div>
    </div>
  );
}
