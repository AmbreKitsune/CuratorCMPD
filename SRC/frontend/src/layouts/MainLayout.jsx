import { useState, useEffect } from "react" 
import { Outlet } from 'react-router'

import Sidebar from "../components/Sidebar/Sidebar"

import { ShiftService as ShiftServiceQuery } from "../services/query/ShiftService"
import { RealtimeService } from "../services/RealtimeService"

import styles from "./MainLayout.module.css"


const title = "☕ WIP-0.5 - UNITS ☕";
const description = "Created by AmbreKitsune · React/Vite + Python/FastAPI";
const visibleReleaseData = false;


export default function MainLayout() {
    function ReleaseData() {
        return (
            <div className={styles.Release}>
                <span className={styles.ReleaseVersion}>{ title }</span>

                <a
                    className={styles.ReleaseWebsite}
                    href="https://ambrekitsune.dev/"
                    target="_blank"
                    rel="noreferrer"
                >
                    { description }
                </a>
            </div>
        )
    }

    const [ShiftInfo, setShiftInfo] = useState({
        phase: null,
        type: null,
        time: 0,
    });


    useEffect(() => {
        const loader = async () => {
            const shift_res = await ShiftServiceQuery.getState();

            setShiftInfo({
                phase: shift_res.shift_phase,
                type: shift_res.shift_type,
                time: shift_res.current_time_minutes
            });

        };

        const unsubscribeUpdater = RealtimeService.subscribe(
            "shift_update",
            ( message ) => {
                setShiftInfo(prev => ({
                    ...prev,
                    phase: message.data.shift_phase ?? prev.phase,
                    type: message.data.shift_type ?? prev.type,
                    time: message.data.current_time_minutes ?? prev.time 
                }));
            },
        );

        loader()
        RealtimeService.connect();


        return () => {
            unsubscribeUpdater();
            RealtimeService.disconnect();
        };
    }, []);

    return (
        <div className={styles.App}>
            <Sidebar ShiftInfo={ShiftInfo} />

            <main className={styles.Main}>
                <Outlet context={{ ShiftInfo }} />
            </main>

            {visibleReleaseData && <ReleaseData />}
        </div>
    )
}
