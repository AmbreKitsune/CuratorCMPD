import { useEffect, useState } from "react";
import { useOutletContext } from "react-router";

import { UnitService as UnitServiceQuery } from "../../services/query/UnitService"
import { RealtimeService } from "../../services/RealtimeService"

import Header from "../../components/header/header";
import styles from "./UnitsPage.module.css";

import List from "./Components/List/List";
import Dossier from "./Components/Dossier/Dossier";


export default function UnitPage() {
    const [units, setUnits] = useState([]);

    useEffect(() => {
        const loader = async () => {
            const res = await UnitServiceQuery.getUnits();
            setUnits(res);
        }

        const unsubscribe = RealtimeService.subscribe(
            "units_update",
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
            <Header title="Экипажи"/>
            
            <div className={styles.Container}>
                <List units={ units }/>
                <Dossier />
            </div>
        </div>
    )
}
