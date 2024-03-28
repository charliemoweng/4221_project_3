import React, { useState, useMemo } from "react";
import {
    GameInfoContext,
    GameInfoContextType,
} from "../../hooks/GameInfoProvider";
import MonsterSelectionButton from "./components/monsterSelectionButton";
import Team from "./components/team";

type Props = {};

const ArenaSection = (props: Props) => {
    const [currTeam, setCurrTeam] = useState<Set<string>>(new Set<string>());

    const { matchInfo } = React.useContext(
        GameInfoContext
    ) as GameInfoContextType;

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
                />
            );
        }

        return buttons;
    }, [matchInfo?.noOfAttributes, currTeam]);

    return (
        <div>
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
                        // "G",
                        // "H",
                        // "J",
                        // "I",
                    ]}
                    flipSprites={false}
                    trainerIsOnRight={true}
                />
            </div>
            {monsterSelectionSection}
        </div>
    );
};

const styles: any = {
    arenaContainer: {
        display: "flex",
        direction: "row",
        justifyContent: "space-between",
        borderWidth: "3px",
        borderColor: "black",
    },
};

export default React.memo(ArenaSection);
