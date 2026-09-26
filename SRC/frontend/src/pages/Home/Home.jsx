import { useState } from "react";

import { ShiftService as ShiftServiceCommand } from "../../services/command/ShiftService";
import { ShiftService as ShiftServiceQuery } from "../../services/query/ShiftService";

import { RealtimeService } from "../../services/RealtimeService";

import styles from "./Home.module.css";

import Header from "../../components/header/header"

const SHIFT_STATUS = {
    REST: "REST",
    PROCESS: "PROCESS",
    WORK: "WORK"
}

const STATUS_CONFIG = {
    [SHIFT_STATUS.REST]: {
        label: "На отдыхе",
        className: styles.rest
    },
    [SHIFT_STATUS.PROCESS]: {
        label: "Подождите...",
        className: styles.process
    },
    [SHIFT_STATUS.WORK]: {
        label: "На работе",
        className: styles.work
    }
}


export default function Home() {
    const [statusShift, setStatusShift] = useState(SHIFT_STATUS.REST)
    const [timerShift, setTimerShift] = useState("00:00")
    const [hideButton, setHideButton] = useState(false);

    const formatTime = (minutes) => {
        const h = Math.floor(minutes / 60);
        const m = minutes % 60;
        return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
    };

    const startShift = async () => {
        await ShiftServiceCommand.start();
    };

    const getStatusShift = async () => {
        const res = await ShiftServiceQuery.getStatus()
        
        if (res.data) {
            setStatusShift(SHIFT_STATUS.WORK);
            setHideButton(true);
        }
    }

    const getTimerShift = async () => {
        const res = await ShiftServiceQuery.getTimer()
        
        if (res.data) {
            setTimerShift(formatTime(res.data));
        }
    }
    
    const toggleShift = () => {
        setHideButton(true);
        setStatusShift(SHIFT_STATUS.PROCESS)

        setTimeout(() => {
            startShift();
        }, 600);
    };


    return (
        <div className={styles.main}>
            <Header title="Главная"/>

            <div className={styles.shift}>
                <div className={styles.shiftStatus}>
                    <span>Статус смены:</span>
                    <span
                        key={statusShift}
                        className={`${styles.status} ${STATUS_CONFIG[statusShift].className}`}
                    >
                        {STATUS_CONFIG[statusShift].label}
                    </span>

                    <button
                        className={`${styles.shiftButton} ${hideButton ? styles.hide : ""}`}
                        onClick={toggleShift}
                    >
                        Выйти на смену
                    </button>
                </div>
                <div className={styles.shiftTimer}>
                    <span>Время:</span>
                    <span>{timerShift}</span>
                </div>

            </div>
        </div>
    )
}
