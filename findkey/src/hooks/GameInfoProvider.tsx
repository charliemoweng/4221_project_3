import React, { useState, useEffect } from "react";

export interface MatchInfo {
    // no of teams (candidates keys) successfully found
    candidateNoOfKeysFound: number;

    // total no of monsters used
    currMonstersUsed: number;

    // curr round number
    currRoundNumber: number;

    // number of rounds for current match
    totalRounds: number;

    // number of attributes for current match
    noOfAttributes: number;

    // the different function dependencies for current match
    // functionalDependencies: An array of functional dependencies
    // array of string, string tuples
    functionalDependencies: [string, string][];

    /**
     * all closures of sets that was previously selected by the player in this match
     * key = set players chose in string form, example "ABC" to represent attributes A, B, C in the set
     * value = the closure in string format. if the closure contains Arribute A, B, C, the value will be "ABC"
     */
    closuresOfSetsUsed: Map<string, string>;
}

export type GameInfoContextType = {
    matchInfo: MatchInfo | null;

    //Checks if the current set was used before
    wasTeamUsedBefore: (team: Set<string>) => boolean;

    // team selected fights opponent and this function returns the opponents defeated (the closure)
    fightOpponent: (team: Set<string>) => Set<string>;

    // go to next round in current match
    handleNewRound: () => void;

    // for resetting the entire match with a new difficulty etc
    handleNewMatch: (difficulty: number) => void;
};

// create new context so it can be accessible
export const GameInfoContext = React.createContext<GameInfoContextType | null>(
    null
);

interface Props {
    children: React.ReactNode;
}

// provides the context to the component's children
const GameInfoProvider = ({ children }: Props) => {
    const [matchInfo, setMatchInfo] = useState<MatchInfo | null>(null);

    useEffect(() => {
        handleNewMatch(0); //TODO: temp to initialize values for testing, remove this after
    }, []);

    // check if a team was used before
    const wasTeamUsedBefore = (team: Set<string>): boolean => {
        const teamStr = Array.from(team).join("");
        return matchInfo?.closuresOfSetsUsed.get(teamStr) !== undefined;
    };

    const fightOpponent = (team: Set<string>): Set<string> => {
        if (matchInfo == null) return new Set<string>();

        // TODO: call function to get closure
        const tempClosure = new Set<string>();
        tempClosure.add("A");
        tempClosure.add("B");
        tempClosure.add("C");
        tempClosure.add("F");

        const teamStr = Array.from(team).join("");
        const closureStr = Array.from(tempClosure).join("");

        const isCandidateKey = tempClosure.size === matchInfo.noOfAttributes;

        // set new values
        setMatchInfo({
            ...matchInfo,
            currMonstersUsed: matchInfo.currMonstersUsed + team.size,
            closuresOfSetsUsed: matchInfo.closuresOfSetsUsed.set(
                teamStr,
                closureStr
            ),
            candidateNoOfKeysFound:
                matchInfo.candidateNoOfKeysFound + (isCandidateKey ? 1 : 0),
        });

        return tempClosure;
    };

    /**
     * handle new round is in a seperate function from fightOpponent for UI animation reasons
     * Allows for components to only re-render when currRoundNumber is updated in the useEffect hook
     *
     * Can see the trainer's sprite animation as an example. Will replay whenever currRoundNumber changes
     */
    const handleNewRound = () => {
        if (matchInfo == null) return;

        setMatchInfo({
            ...matchInfo,
            currRoundNumber: matchInfo.currRoundNumber + 1,
        });
    };

    // for resetting game or starting
    const handleNewMatch = (difficulty: number) => {
        // TODO: call the functions to generate FDs and no of attributes here based on difficulty

        // TODO: replace hardcoded example with generated FDs
        const tempFDs = new Array<[string, string]>();
        tempFDs.push(["A", "BC"]);
        tempFDs.push(["BC", "D"]);
        tempFDs.push(["D", "EF"]);
        tempFDs.push(["H", "GIJ"]);
        const noAttributes = 10;

        setMatchInfo({
            candidateNoOfKeysFound: 0,
            currMonstersUsed: 0,
            currRoundNumber: 1,
            totalRounds: 2, // TODO: change this based on difficulty
            noOfAttributes: noAttributes, // TODO: generate this
            functionalDependencies: tempFDs,
            closuresOfSetsUsed: new Map<string, string>(),
        });
    };

    return (
        <GameInfoContext.Provider
            value={{
                matchInfo,
                handleNewMatch,
                wasTeamUsedBefore,
                fightOpponent,
                handleNewRound,
            }}
        >
            {children}
        </GameInfoContext.Provider>
    );
};

export default GameInfoProvider;
