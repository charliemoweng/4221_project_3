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

    /**
     * all closures of sets that was previously selected by the player in this match
     * key = set players chose in string form, example "ABC" to represent attributes A, B, C in the set
     * value = the closure in string format
     */
    closuresOfSetsUsed: Map<string, string>;
}

export type GameInfoContextType = {
    matchInfo: MatchInfo | null;

    //TODO: functions to create
    // Check if team selected is a candidate key: return true or false, show appropriately, add values accordingly
    // go to next round, update round info and stuff

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

    const handleNewMatch = (difficulty: number) => {
        // TODO: call the functions to generate FDs and no of attributes here based on difficulty

        setMatchInfo({
            candidateNoOfKeysFound: 0,
            currMonstersUsed: 0,
            currRoundNumber: 1,
            totalRounds: 2, // TODO: change this based on difficulty
            noOfAttributes: 10, // TODO: generate this
            closuresOfSetsUsed: new Map<string, string>(),
        });
    };

    return (
        <GameInfoContext.Provider value={{ matchInfo, handleNewMatch }}>
            {children}
        </GameInfoContext.Provider>
    );
};

export default GameInfoProvider;
