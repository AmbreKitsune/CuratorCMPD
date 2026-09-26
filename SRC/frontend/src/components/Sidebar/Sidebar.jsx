import { useState } from "react";
import { NavLink } from "react-router";
import { ShieldUser, UserPlus, Phone, UserSearch, Shield, Armchair, ChevronDown } from "lucide-react";

import { ShiftService as ShiftServiceCommand } from "../../services/command/ShiftService";

import { SHIFT_PHASE, SHIFT_TYPE } from "../../domain/shift"

import styles from "./Sidebar.module.css";


const NAVIGATION = [
    {
        category: "Главная",
        tabs: [
            { title: "Главная", to: "/", icon: Armchair},
            { title: "Вызовы", to: "/coming_soon", icon: Phone},
        ]
    },
    {
        category: "Сотрудники",
        tabs: [
            { title: "Группы", to: "/units", icon: Shield},
            { title: "Состав", to: "/officers", icon: UserSearch},
            { title: "Набор", to: "/recruitment", icon: UserPlus},
        ]
    },
];

const SHIFT_CONFIG = {
    loader: {
        title: "Подождите",
        style: "",
        disabled: true,
    },

    phase: {
        [SHIFT_PHASE.RESTING]: {
            title: "Куратор вне службы",
            style: styles.PhaseResting
        },
        [SHIFT_PHASE.AVAILABLE]: {
            title: "Куратор доступен",
            style: styles.PhaseAvailable
        },
        [SHIFT_PHASE.ACTIVE]: {
            title: "Куратор на службе",
            style: styles.PhaseActive
        },
        [SHIFT_PHASE.SIGNED_OFF]: {
            title: "Куратор закончил смену",
            style: styles.PhaseSignedOff
        }
    },

    button_shift: {
        [SHIFT_PHASE.RESTING]: {
            title: "Отправить на базу",
            disabled: false
        },
        [SHIFT_PHASE.AVAILABLE]: {
            title: "Начать смену",
            disabled: false
        },
        [SHIFT_PHASE.ACTIVE]: {
            title: "-",
            disabled: true
        },
        [SHIFT_PHASE.SIGNED_OFF]: {
            title: "Отправиться домой",
            disabled: false
        }
    },

    type: {
        [SHIFT_TYPE.DAY]: {
            title: "Дневная",
            style: styles.Day
        },
        [SHIFT_TYPE.NIGHT]: {
            title: "Ночная",
            style: styles.Night
        }
    }
};


export default function Sidebar({ShiftInfo}) {
    const PhaseInfo = SHIFT_CONFIG.phase[ShiftInfo.phase] ?? SHIFT_CONFIG.loader;
    const ButtonInfo = SHIFT_CONFIG.button_shift[ShiftInfo.phase] ?? SHIFT_CONFIG.loader;
    const TypeInfo = SHIFT_CONFIG.type[ShiftInfo.type] ?? SHIFT_CONFIG.loader;


    const [open, setOpen] = useState({
        "Главная": true,
        "Сотрудники": false
    });

    const toggle = (category) => {
        setOpen(prev => ({
            ...prev,
            [category]: !prev[category]
        }));
    };

    const formatTime = (minutes) => {
        const h = Math.floor(minutes / 60);
        const m = minutes % 60;
        return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
    };

    const toggleShift = async () => {
        await ShiftServiceCommand.start();
    };

    return (
        <aside className={styles.Sidebar}>
            <div className={styles.Logo}>
                <div className={styles.LogoIco}>
                    <ShieldUser size={48}/>
                </div>
                <div className={styles.LogoText}>
                    <span className={styles.LogoTextName}>
                        CURATOR CMPD
                    </span>
                    <span className={styles.LogoTextDesc}>
                        Версия:{" "}
                        <span className={styles.LogoVersion}>r-2.5.1</span>
                    </span>
                </div>
            </div>

            <div className={styles.Shift}>
                <span className={styles.ShiftTitle}>Информация смены</span>

                <div className={styles.ShiftInfo}>
                    <span
                        className={`${styles.ShiftPhase} ${PhaseInfo.style}`}
                    >
                        {PhaseInfo.title}
                    </span>

                    <span className={styles.ShiftTypeTitle}>Тип смены</span>
                    <span className={styles.ShiftTimeTitle}>Время</span>

                    <span
                        className={`${styles.ShiftTypeValue} ${TypeInfo.style}`}
                    >
                        {TypeInfo.title}
                    </span>

                    <span className={styles.ShiftTimeValue}>{formatTime(ShiftInfo.time)}</span>
                </div>

                <button 
                    className={`${styles.ShiftButton} ${ButtonInfo.style}`}
                    onClick={toggleShift}
                    disabled={ButtonInfo.disabled}
                >
                    {ButtonInfo.title}
                </button>
            </div>

            <div className={styles.Nav}>
                {NAVIGATION.map((category) => {
                    return (
                        <div className={styles.Category} key={category.category}>
                            
                            <div
                                className={styles.HeaderTabs}
                                onClick={() => toggle(category.category)}
                            >
                                <span>{category.category}</span>

                                <ChevronDown
                                    size={16}
                                    className={open[category.category] ? styles.Rotate : ""}
                                />
                            </div>

                            {open[category.category] && (
                                <div className={styles.Tabs}>
                                    {category.tabs.map((tab) => {
                                        const Icon = tab.icon;

                                        return (
                                            <NavLink
                                                key={`${category.category}-${tab.title}`}
                                                to={tab.to}
                                                className={({ isActive }) =>
                                                    `${styles.Tab} ${isActive ? styles.Active : ""}`
                                                }
                                            >
                                                <div className={styles.TabIcon}>
                                                    <Icon size={20}/>
                                                </div>

                                                <span className={styles.TabTitle}>{tab.title}</span>
                                            </NavLink>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            <div className={styles.profile}>
                <div className={styles.profileAvatar}>🦊</div>

                <div className={styles.profileInfo}>
                    <span className={styles.profileName}>Куратор</span>
                    <span className={styles.profileRole}>Доступ: штатный</span>
                </div>
            </div>
        </aside>
    );
}
