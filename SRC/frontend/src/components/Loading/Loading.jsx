import { useEffect, useState } from "react";
import styles from "./Loading.module.css";

export default function LoadingDay({ onFinish }) {
  const moons = ["🌑", "🌒", "🌓", "🌔", "🌕", "🌖", "🌗", "🌘"];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % moons.length);
    }, 300);

    const timer = setTimeout(() => {
      onFinish();
    }, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className={styles.main}>
      <div className={styles.logo}>
        <span>{moons[index]}</span>
      </div>
      <h1 className={styles.text}>Загрузка нового дня</h1>
    </div>
  );
}
