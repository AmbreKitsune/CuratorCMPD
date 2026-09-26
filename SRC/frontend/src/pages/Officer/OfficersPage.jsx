import { useEffect, useState } from "react";

import { OfficerService as OfficerServiceQuery } from "../../services/query/OfficerService"
import { RealtimeService } from "../../services/RealtimeService"

import Header from "../../components/header/header";
import styles from "./OfficerPage.module.css";

import List from "./Components/List/List";
import Dossier from "./Components/Dossier/Dossier";


export default function OfficerPage() {
    const [officers, setOfficers] = useState([]);

    useEffect(() => {
        const loader = async () => {
            const res = await OfficerServiceQuery.getOfficers();
            setOfficers(res);
        }

        const unsubscribe = RealtimeService.subscribe(
            "officers_update",
            () => {
                loader();
            }
        );

        loader();

        return () => {
            unsubscribe();
        };
    }, []);

    return (
        <div className={styles.Main}>
            <Header title="Состав офицеров"/>
            
            <div className={styles.Container}>
                <List officers={ officers }/>
                <Dossier />
            </div>
        </div>
    )
}
