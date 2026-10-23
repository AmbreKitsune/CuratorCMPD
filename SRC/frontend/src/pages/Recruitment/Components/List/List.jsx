import styles from "./List.module.css";

import CandidateCard from "../Card/Card";

export default function CandidateList({ candidates }) {
  return (
    <div className={styles.List}>
      <div className={styles.Header}>
        <span>КАНДИДАТЫ · {candidates.length}</span>
      </div>

      <div className={styles.Candidate}>
        {candidates.map((item) => (
          <CandidateCard
            key={item.id}
            id={item.id}
            first_name={item.first_name}
            last_name={item.last_name}
            age={item.age}
          />
        ))}
      </div>
    </div>
  );
}
