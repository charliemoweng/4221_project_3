import React, { useState, useMemo, useEffect } from "react";
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

const FIGHT_CLOUD_ANIM_TIME = 2000; //its in miliseconds

const ArenaSection = (props: Props) => {
    const [currTeam, setCurrTeam] = useState<Set<string>>(new Set<string>());
    const [isSelectingTeam, setIsSelectingTeam] = useState<boolean>(true);
    const [alertState, setAlertState] = useState<AlertStates>(AlertStates.NONE);
    const [showFightCloud, setShowFightCloud] = useState<boolean>(false);

    // to keep track of values after fighting
    const [enemiesDead, setEnemiesDead] = useState<Set<string>>(
        new Set<string>()
    );
    const [isWinRound, setIsWinRound] = useState<boolean>(false);

    const { matchInfo, wasTeamUsedBefore, fightOpponent, handleNewRound, handleNewMatch } =
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

        // show animation
        setShowFightCloud(true);
        setAlertState(AlertStates.NONE);

        setTimeout(() => {
            setShowFightCloud(false);
            // get closure and whether all the enemies were wiped out
            setEnemiesDead(fightOpponent(currTeam))
        }, FIGHT_CLOUD_ANIM_TIME);
    };

    const startNewGame = () => {
        // reset states
        setCurrTeam(new Set<string>());
        setEnemiesDead(new Set<string>());
        setIsSelectingTeam(true);
        setIsWinRound(false);
        setAlertState(AlertStates.NONE);

        // start new game
        handleNewMatch(0);
    };

    useEffect(() => {
        if (enemiesDead.size != 0) {
            if (enemiesDead.size === matchInfo?.noOfAttributes) {
                setIsWinRound(true);
                setAlertState(AlertStates.WIN);
            } else {
                setIsWinRound(false);
                setAlertState(AlertStates.LOSE);
                // Change fight button to next round button
                setIsSelectingTeam(false);
            }
            
        }
    }, [enemiesDead]); 

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

    const renderFightCloud = () => {
        return (
            <img
                src={require(`../../assets/fightcloud.gif`)}
                alt={`fight cloud animation`}
                style={{
                    ...styles.fightCloud,
                }}
            />
        );
    };

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
                {alertState === AlertStates.WIN ?
                    <Button
                        variant="contained"
                        onClick={startNewGame}
                        sx={[styles.nextRoundButton, styles.button]}
                    >
                        <GiNextButton />
                        New Game
                    </Button>
                : isSelectingTeam ? (
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
            {showFightCloud && renderFightCloud()}
        </div>
    );
};

const styles: any = {
    container: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        height: "auto",
        position: "relative",
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
    fightCloud: {
        position: "absolute",
        left: 0,
        right: 0,
        marginLeft: "auto",
        marginRight: "auto",
        width: "100%",
        height: "100%",
    },
};

export default React.memo(ArenaSection);
