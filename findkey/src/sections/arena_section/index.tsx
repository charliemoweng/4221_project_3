import React, { useState, useMemo } from "react";
import {
    GameInfoContext,
    GameInfoContextType,
} from "../../hooks/GameInfoProvider";
import MonsterSelectionButton from "./components/monsterSelectionButton";

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
            console.log("Je;;p??");
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

    return <div>{monsterSelectionSection}</div>;
};

export default React.memo(ArenaSection);
