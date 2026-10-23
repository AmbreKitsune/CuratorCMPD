import { useEffect, useState } from "react";

import { CandidateService as CandidateServiceQuery } from "../../services/query/CandidateService";
import { RealtimeService } from "../../services/RealtimeService";

import Header from "../../components/Header/Header";
import styles from "./RecruitmentPage.module.css";

import List from "./Components/List/List";
import Dossier from "./Components/Dossier/Dossier";

export default function RecruitmentPage() {
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    const loader = async () => {
      const res = await CandidateServiceQuery.getCandidates();
      if (res) {
        setCandidates(res);
      }
    };

    const unsubscribe = RealtimeService.subscribe("candidates_update", () => {
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
        title="Рассмотрение кандидатур"
        subtitle="Рассмотрение личных дел, поступивших из отдела набора кадров, и принятие решений о зачислении на службу."
      />

      <div className={styles.Container}>
        <List candidates={candidates} />
        <Dossier />
      </div>
    </div>
  );
}
