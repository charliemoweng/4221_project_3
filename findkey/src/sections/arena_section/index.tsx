import React, { useState, useMemo } from "react";
import {
    GameInfoContext,
    GameInfoContextType,
} from "../../hooks/GameInfoProvider";
import { Button } from "@mui/material";
import MonsterSelectionButton from "./components/monsterSelectionButton";
import Team from "./components/team";

type Props = {};

const ArenaSection = (props: Props) => {
    const [currTeam, setCurrTeam] = useState<Set<string>>(new Set<string>());
    const [isSelectingTeam, setIsSelectingTeam] = useState<boolean>(true);

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
        if (currTeam.size === 0) return;

        // check whether set already exists
        if (wasTeamUsedBefore(currTeam)) return;

        // get closure and whether all the enemies were wiped out
        setEnemiesDead(fightOpponent(currTeam));

        // if enemies dead size is the number of attributes, it means the enemy team got wiped, player won
        setIsWinRound(enemiesDead.size === matchInfo?.noOfAttributes);

        //change fight button to next round button
        setIsSelectingTeam(false);
    };

    const startNextRound = () => {
        // reset states
        setCurrTeam(new Set<string>());
        setEnemiesDead(new Set<string>());
        setIsSelectingTeam(true);
        setIsWinRound(false);

        // start next round
        handleNewRound();
    };

    const monsterSelectionSection = useMemo(() => {
        const buttons = [];
        if (matchInfo === null) return;

        for (let i = 0; i < matchInfo.noOfAttributes; ++i) {
            let id = String.fromCharCode(64 + i + 1); // map integer to capital letters
            buttons.push(
                <MonsterSelectionButton
                    key={i}
                    id={id}
                    isSelected={currTeam.has(id)}
                    onClick={
                        currTeam.has(id) ? removeTeamMember : addTeamMember
                    }
                    style={styles.selectionButton}
                />
            );
        }

        return <div style={styles.selectionContainer}>{buttons}</div>;
    }, [matchInfo?.noOfAttributes, currTeam]);

    return (
        <div style={styles.container}>
            <div style={styles.arenaContainer}>
                <Team
                    teamSize={matchInfo ? matchInfo.noOfAttributes : 0}
                    trainerName="player"
                    monsters={[...currTeam]}
                    flipSprites={true}
                    trainerIsOnRight={false}
                />
                <Team
                    teamSize={matchInfo ? matchInfo.noOfAttributes : 0}
                    trainerName="opponent"
                    monsters={[
                        "A",
                        "B",
                        "C",
                        "D",
                        "E",
                        "F",
                        "G",
                        "H",
                        "J",
                        "I",
                    ]}
                    flipSprites={false}
                    trainerIsOnRight={true}
                    deadMonsters={enemiesDead}
                />
            </div>
            {monsterSelectionSection}
            {isSelectingTeam ? (
                <Button variant="contained" onClick={handleFight}>
                    Fight
                </Button>
            ) : (
                <Button variant="contained" onClick={startNextRound}>
                    Next Round
                </Button>
            )}
        </div>
    );
};

const styles: any = {
    container: {
        display: "flex",
        flexDirection: "column",
    },
    selectionContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
    },
    selectionButton: {
        height: "100px",
        width: "100px",
    },
    arenaContainer: {
        display: "flex",
        direction: "row",
        justifyContent: "space-between",
        borderWidth: "3px",
        borderColor: "black",
        margin: "70px",
    },
};

export default React.memo(ArenaSection);
