import React, { useState, useMemo } from "react";
import {
    GameInfoContext,
    GameInfoContextType,
} from "../../hooks/GameInfoProvider";
import { Button, Alert } from "@mui/material";
import MonsterSelectionButton from "./components/monsterSelectionButton";
import Team from "./components/team";
import { GiShardSword, GiNextButton } from "react-icons/gi";

type Props = {};

enum AlertStates {
    NONE,
    NO_MONSTERS_PICKED,
    TEAM_PICKED_BEFORE,
    WIN,
    LOSE,
}

const ArenaSection = (props: Props) => {
    const [currTeam, setCurrTeam] = useState<Set<string>>(new Set<string>());
    const [isSelectingTeam, setIsSelectingTeam] = useState<boolean>(true);
    const [alertState, setAlertState] = useState<AlertStates>(AlertStates.NONE);

    // to keep track of values after fighting
    const [enemiesDead, setEnemiesDead] = useState<Set<string>>(
        new Set<string>()
    );
    const [isWinRound, setIsWinRound] = useState<boolean>(false);

    const { matchInfo, wasTeamUsedBefore, fightOpponent, handleNewRound } =
        React.useContext(GameInfoContext) as GameInfoContextType;

    const addTeamMember = (id: string) => {
        const newSet = new Set(currTeam);
        newSet.add(id);
        setCurrTeam(newSet);
    };

    const removeTeamMember = (id: string) => {
        const newSet = new Set(currTeam);
        newSet.delete(id);
        setCurrTeam(newSet);
    };

    const handleFight = () => {
        // check if it is empty
        if (currTeam.size === 0) {
            setAlertState(AlertStates.NO_MONSTERS_PICKED);
            return;
        }

        // check whether set already exists
        if (wasTeamUsedBefore(currTeam)) {
            setAlertState(AlertStates.TEAM_PICKED_BEFORE);
            return;
        }

        // get closure and whether all the enemies were wiped out
        setEnemiesDead(fightOpponent(currTeam));

        // if enemies dead size is the number of attributes, it means the enemy team got wiped, player won
        setIsWinRound(enemiesDead.size === matchInfo?.noOfAttributes);
        setAlertState(isWinRound ? AlertStates.WIN : AlertStates.LOSE);

        //change fight button to next round button
        setIsSelectingTeam(false);
    };

    const startNextRound = () => {
        // reset states
        setCurrTeam(new Set<string>());
        setEnemiesDead(new Set<string>());
        setIsSelectingTeam(true);
        setIsWinRound(false);
        setAlertState(AlertStates.NONE);

        // start next round
        handleNewRound();
    };

    const monsterTypes: Set<string> = useMemo(() => {
        const monsters = new Set<string>();
        if (matchInfo === null) return monsters;

        for (let i = 0; i < matchInfo.noOfAttributes; ++i) {
            let id = String.fromCharCode(64 + i + 1);
            monsters.add(id);
        }

        return monsters;
    }, [matchInfo?.noOfAttributes]);

    // if player could not wipe enemy team, it means their team got wiped
    const isPlayerTeamWiped = () => {
        return !isSelectingTeam && !isWinRound;
    };

    const renderAlerts = () => {
        return (
            <div style={styles.popup}>
                {alertState === AlertStates.NO_MONSTERS_PICKED && (
                    <Alert severity="error" sx={styles.alert}>
                        Your team is empty! You need to select at least 1
                        monster!
                    </Alert>
                )}
                {alertState === AlertStates.TEAM_PICKED_BEFORE && (
                    <Alert severity="warning" sx={styles.alert}>
                        You already selected this combination of monsters! Pick
                        a different combination.
                    </Alert>
                )}
                {alertState === AlertStates.WIN && (
                    <Alert severity="success" sx={styles.alert}>
                        Successfully defeated the enemy's team!
                    </Alert>
                )}
                {alertState === AlertStates.LOSE && (
                    <Alert severity="warning" sx={styles.alert}>
                        You were unable to full wipe the enemy's team and lost
                        this round...
                    </Alert>
                )}
            </div>
        );
    };

    const renderMonsterSelectionSection = useMemo(() => {
        const buttons: any[] = [];
        if (matchInfo === null) return;

        monsterTypes?.forEach((id) => {
            buttons.push(
                <MonsterSelectionButton
                    isDisabled={!isSelectingTeam}
                    key={id}
                    id={id}
                    isSelected={currTeam.has(id)}
                    onClick={
                        currTeam.has(id) ? removeTeamMember : addTeamMember
                    }
                    style={styles.selectionButton}
                />
            );
        });

        return <div style={styles.selectionButtonContainer}>{buttons}</div>;
    }, [monsterTypes, currTeam, isSelectingTeam]);

    return (
        <div style={styles.container}>
            <div style={styles.arenaContainer}>
                <Team
                    teamSize={matchInfo ? matchInfo.noOfAttributes : 0}
                    trainerName="player"
                    monsters={[...currTeam]}
                    flipSprites={true}
                    trainerIsOnRight={false}
                    deadMonsters={
                        isPlayerTeamWiped() ? monsterTypes : undefined
                    }
                />
                <Team
                    teamSize={matchInfo ? matchInfo.noOfAttributes : 0}
                    trainerName="opponent"
                    monsters={Array.from(monsterTypes)}
                    flipSprites={false}
                    trainerIsOnRight={true}
                    deadMonsters={enemiesDead}
                />
            </div>
            <div style={styles.selectionContainer}>
                {renderMonsterSelectionSection}
                {isSelectingTeam ? (
                    <Button
                        variant="contained"
                        onClick={handleFight}
                        sx={[styles.fightButton, styles.button]}
                    >
                        <GiShardSword size={40} />
                        Fight
                    </Button>
                ) : (
                    <Button
                        variant="contained"
                        onClick={startNextRound}
                        sx={[styles.nextRoundButton, styles.button]}
                    >
                        <GiNextButton />
                        Next Round
                    </Button>
                )}
                {renderAlerts()}
            </div>
        </div>
    );
};

const styles: any = {
    container: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
    },
    arenaContainer: {
        display: "flex",
        direction: "row",
        justifyContent: "space-between",
        borderWidth: "3px",
        borderColor: "black",
        margin: "70px",
    },
    selectionButtonContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
    },
    selectionButton: {
        height: "100px",
        width: "100px",
    },
    selectionContainer: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    button: {
        marginTop: "30px",
        width: "220px",
        height: "60px",
        justifyContent: "space-evenly",
        fontSize: 20,
        fontWeight: "bold",
    },
    fightButton: {
        backgroundColor: "#FF8C00",
        ":hover": {
            backgroundColor: "#E55A00",
        },
    },
    nextRoundButton: {
        backgroundColor: "#007DFF",
        ":hover": {
            backgroundColor: "#0060C3",
        },
    },
    popup: {
        marginTop: "30px",
        width: "800px",
    },
    alert: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: 20,
        "& .MuiAlert-icon": {
            fontSize: 40,
        },
    },
};

export default React.memo(ArenaSection);
