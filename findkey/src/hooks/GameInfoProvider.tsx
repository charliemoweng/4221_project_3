import React, { useState, useEffect } from "react";
import functionalDependencies from "../sections/arena_section/components/functionalDependencies";

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

        const tempClosure = getClosure(team);
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
     * Get the closure of a set of attributes
     */
    const getClosure = (team: Set<string>): Set<string> => {
        let closure: Set<string> = new Set(team);
        let added: boolean = true;

        while (added) {
            added = false;
            matchInfo?.functionalDependencies.forEach((fd) => {
                const lhs = new Set(fd[0].split(''));
                const rhs = new Set(fd[1].split(''));

                // Check if LHS is a subset of the closure
                const lhsIsSubset = Array.from(lhs).every(attr => closure.has(attr));
                // Check if any part of RHS is not in closure
                const rhsIsNotSubset = Array.from(rhs).some(attr => !closure.has(attr));

                if (lhsIsSubset && rhsIsNotSubset) {
                    rhs.forEach(attr => closure.add(attr));
                    added = true;
                }
            });
        }

        return closure;
    }

    /**
     * Generate FDs based on difficulty
     */
    const generateFDs = (numAttributes: number, difficulty: number, ): [string, string][] => {
        // Generate Attributes
        const attributes = Array.from({ length: numAttributes }, (_, i) => String.fromCharCode(65 + i));

        // Generate Candidate Keys
        const candidateKeySize: number = Math.floor(Math.random() * (Math.max(2, attributes.length / 2) - 1)) + 1;
        const shuffledAttributes: string[] = [...attributes].sort(() => 0.5 - Math.random());
        const candidateKeyAttributes: Set<string> = new Set(shuffledAttributes.slice(0, candidateKeySize));

        console.log("Candidate Key: ", candidateKeyAttributes);
        console.log("Difficulty: ", difficulty)

        // Generate FDs
        let fds: Set<[string, string]> = new Set();

        // Difficulty >= 0: Basic FDs where non-candidate key attributes depend on the candidate key or part of it
        if (difficulty >= 0) {
            attributes.filter(attr => !candidateKeyAttributes.has(attr)).forEach(nonCandidate => {
            const subsetCandidateKey: string[] = [...candidateKeyAttributes].sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * candidateKeySize) + 1);
            fds.add([subsetCandidateKey.join(''), nonCandidate]);
            });
        }
        
        // Difficulty >= 1: Additional FDs without introducing new candidate keys
        if (difficulty >= 1) {
            const nonCandidateAttributes: string[] = attributes.filter(attr => !candidateKeyAttributes.has(attr));
            for (let i = 0; i < numAttributes; i++) {
            const determinantSize: number = Math.floor(Math.random() * (attributes.length - 1)) + 1;
            // Ensure at least one non-candidate attribute in the determinant to prevent new candidate keys
            const determinant: string[] = [...candidateKeyAttributes].sort(() => 0.5 - Math.random()).slice(0, determinantSize - 1);
            determinant.push(nonCandidateAttributes[Math.floor(Math.random() * nonCandidateAttributes.length)]);
            const dependents: string[] = attributes.filter(attr => !determinant.includes(attr) && !candidateKeyAttributes.has(attr));
            fds.add([determinant.join(''), dependents[Math.floor(Math.random() * dependents.length)]]);
            }
        }

        const fdList: Array<[string, string]> = Array.from(fds);

        return fdList;
    }
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
        // TODO: Call a function to set noOfAttributes based on difficulty
        const noAttributes = 10;

        const tempFDs = generateFDs(noAttributes, difficulty);

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
