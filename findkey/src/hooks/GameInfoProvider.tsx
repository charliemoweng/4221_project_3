import React, { useState } from "react";
import difficultyData from "../data/Difficulty.json";

export interface MatchInfo {
    // total no of candidate keys for current match
    totalNoOfCandidateKeys: number;

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

    /**
     * different function dependencies for current match
     * array of string, string tuples
     */
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

    // check if a team was used before
    const wasTeamUsedBefore = (team: Set<string>): boolean => {
        const teamStr = Array.from(team).sort().join("");
        return matchInfo?.closuresOfSetsUsed.get(teamStr) !== undefined;
    };

    const fightOpponent = (team: Set<string>): Set<string> => {
        if (matchInfo == null) return new Set<string>();

        const tempClosure = getClosure(team);
        const teamStr = Array.from(team).sort().join("");
        const closureStr = Array.from(tempClosure).sort().join("");

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
                const lhs = new Set(fd[0].split(""));
                const rhs = new Set(fd[1].split(""));

                // Check if LHS is a subset of the closure
                const lhsIsSubset = Array.from(lhs).every((attr) =>
                    closure.has(attr)
                );
                // Check if any part of RHS is not in closure
                const rhsIsNotSubset = Array.from(rhs).some(
                    (attr) => !closure.has(attr)
                );

                if (lhsIsSubset && rhsIsNotSubset) {
                    rhs.forEach((attr) => closure.add(attr));
                    added = true;
                }
            });
        }

        return closure;
    };

    /**
     * Check if a set is a subset of another set
     */
    const isSubset = (smaller: string[], larger: string[]): boolean => {
        return smaller.every((element) => larger.includes(element));
    };

    /**
     * Check if a new key is valid
     */
    const isValidKey = (
        newKey: string[],
        existingKeys: string[][]
    ): boolean => {
        // Check if the new key is a subset of any existing key or if any existing key is a subset of the new key
        for (let i = 0; i < existingKeys.length; i++) {
            if (
                isSubset(newKey, existingKeys[i]) ||
                isSubset(existingKeys[i], newKey)
            ) {
                return false;
            }
        }
        return true;
    };

    const generateCandidateKey = (
        attributes: string[],
        existingKeys: string[][]
    ): string[] => {
        let attempts = 0;
        while (attempts < 100) {
            // Limit attempts to avoid infinite loops
            // keylength should not be more than half the number of attributes
            const keyLength = Math.max(
                Math.floor(Math.random() * (attributes.length / 2)) + 1,
                Math.floor(attributes.length / 2)
            );
            let newKey: string[] = [];

            while (newKey.length < keyLength) {
                const randomIndex = Math.floor(
                    Math.random() * attributes.length
                );
                const attribute = attributes[randomIndex];
                if (!newKey.includes(attribute)) {
                    newKey.push(attribute);
                }
            }

            if (isValidKey(newKey, existingKeys)) {
                return newKey;
            }

            attempts++;
        }
        throw new Error(
            "Unable to generate a valid candidate key after multiple attempts. Consider revising the criteria or attributes."
        );
    };

    const generateBasicFDs = (
        attributes: string[],
        candidateKeys: string[][],
        noOfFDs: number
    ): Set<[string, string]> => {
        // Step 1: Split the no. of FDs between the candidate keys
        const fdsPerKey: number = Math.floor(noOfFDs / candidateKeys.length);

        // Step 2: Generate FDs for each candidate key
        // Since fdsPerkey can be smaller than non-key attributes, we need to create subsets of the candidate key
        let fds: Set<[string, string]> = new Set();
        candidateKeys.forEach((candidateKey) => {
            // Get remaining attributes for the candidate key
            const candidateKeyAttributes = new Set(candidateKey);
            let nonCandidateAttributes = attributes.filter(
                (attr) => !candidateKeyAttributes.has(attr)
            );

            // Calculate how many loops to run if we add fdsPerKey FDs for each candidate key
            let remainingAttributes = nonCandidateAttributes.length;
            let remainingFDs = fdsPerKey;

            // Partition the remaining attributes into fdsPerKey subsets of any length
            while (remainingAttributes > 0) {
                const subsetSize = Math.ceil(
                    remainingAttributes / remainingFDs
                );
                const dependent = nonCandidateAttributes.slice(0, subsetSize);
                nonCandidateAttributes =
                    nonCandidateAttributes.slice(subsetSize);
                remainingAttributes -= subsetSize;
                remainingFDs--;

                // Add the FD to the set
                fds.add([candidateKey.join(""), dependent.join("")]);
            }
        });

        return fds;
    };

    const generateAugmentedFDs = (
        basicFDs: Set<[string, string]>
    ): Set<[string, string]> => {
        // Randomly drop 1 or more attributes from the determinant of each FD
        let fds: Set<[string, string]> = new Set();
        basicFDs.forEach((fd) => {
            const [determinant, dependent] = fd;
            const determinantAttributes = determinant.split("");

            // Delete more than 1 attribute but keep at least 1 attribute in the determinant
            const determinantSize =
                Math.floor(Math.random() * (determinantAttributes.length - 1)) +
                1;
            const newDeterminant = determinantAttributes
                .sort(() => 0.5 - Math.random())
                .slice(0, determinantSize);
            fds.add([newDeterminant.join(""), dependent]);
        });

        return fds;
    };

    const generateTransitiveFDs = (
        basicFDs: Set<[string, string]>
    ): Set<[string, string]> => {
        // Randomly add transitive FDs
        let fds: Set<[string, string]> = new Set();

        // If fds' RHS is more than 1, we can add a transitive FD
        basicFDs.forEach((fd) => {
            const [determinant, dependent] = fd;
            if (dependent.length > 1) {
                const dependentAttributes = dependent.split("");
                const transitiveAttribute =
                    dependentAttributes[
                        Math.floor(Math.random() * dependentAttributes.length)
                    ];

                // Remove the transitive attribute from the dependent set
                const newDependent = dependentAttributes
                    .filter((attr) => attr !== transitiveAttribute)
                    .join("");

                // Add the 2 FDs to the set
                fds.add([determinant, transitiveAttribute]);
                fds.add([transitiveAttribute, newDependent]);
            } else {
                fds.add(fd);
            }
        });

        // if two FDs are such that A -> B, AC -> D, then we can add A -> B and BC -> D
        let newFDs: Set<[string, string]> = new Set();
        let fdsArray = Array.from(fds);

        // Keep an edited set of FDs. To keep track of FDs that have already been processed
        let processedFDs: Set<[string, string]> = new Set();

        // Iterate through all FDs
        fdsArray.forEach((fd1, index1) => {
            // Check if the FD has already been processed
            if (!processedFDs.has(fd1)) {
                fdsArray.forEach((fd2, index2) => {
                    // Check if the FD has already been processed
                    if (!processedFDs.has(fd2)) {
                        if (index1 !== index2) {
                            const [lhs1, rhs1] = fd1; // Destructure the first FD
                            const [lhs2, rhs2] = fd2; // Destructure the second FD

                            // Check if LHS of the first FD is a subset of the LHS of the second FD
                            // And if RHS of the first FD is not part of the LHS of the second FD
                            // This checks for a condition similar to A -> B and AC -> D to then create BC -> D
                            if (lhs2.includes(lhs1) && !lhs2.includes(rhs1)) {
                                // Construct the new LHS by removing lhs1 from lhs2 and adding rhs1 to it
                                let newLHS = lhs2
                                    .split("")
                                    .filter(
                                        (char) =>
                                            char !== lhs1 &&
                                            !rhs1.includes(char)
                                    )
                                    .concat(rhs1.split(""))
                                    .sort()
                                    .join("");
                                let newRHS = rhs2;
                                // Add the new FD to the set
                                newFDs.add([newLHS, newRHS]);
                                // Add the FD to the processed set
                                processedFDs.add(fd2);
                            }
                        }
                    }
                });

                // Include the original FD if it has not been processed
                newFDs.add(fd1);
            }
        });

        return newFDs;
    };

    /**
     * Generate FDs based on difficulty
     */
    const generateFDs = (
        numAttributes: number,
        difficultyInfo: any
    ): Array<[string, string]> => {
        // Get difficulty information
        const noOfFDs: number =
            Math.floor(
                Math.random() *
                    (difficultyInfo.max_FDs - difficultyInfo.min_FDs + 1)
            ) + difficultyInfo.min_FDs;
        const noOfCandidateKeys: number = difficultyInfo.candidate_keys;
        const addRedundantFDs: boolean = difficultyInfo.redundant;
        const addCyclicFDs: boolean = difficultyInfo.cyclic;

        // Generate Attributes
        const attributes = Array.from({ length: numAttributes }, (_, i) =>
            String.fromCharCode(65 + i)
        );

        // Generate Candidate Keys
        let candidateKeys: string[][] = [];
        for (let i = 0; i < noOfCandidateKeys; i++) {
            // Insert the array as an element
            candidateKeys.push(generateCandidateKey(attributes, candidateKeys));
        }

        console.log("Candidate Key: ", candidateKeys);
        console.log("Difficulty: ", difficultyInfo.name);

        // Generate Basic FDs
        let fds: Set<[string, string]> = generateBasicFDs(
            attributes,
            candidateKeys,
            noOfFDs
        );

        console.log("Basic FDs: ", fds);

        // Make Augmented FDs
        fds = generateAugmentedFDs(fds);

        console.log("Augmented FDs: ", fds);

        // Make Transitive FDs
        fds = generateTransitiveFDs(fds);

        console.log("Transitive FDs: ", fds);

        // Add Redundant FDs (20% of the no. of FDs)
        const redundantFDs: number = Math.floor(noOfFDs * 0.2);

        if (addRedundantFDs) {
            candidateKeys.forEach((candidateKey) => {
                const candidateKeyAttributes = new Set(candidateKey);
                const nonCandidateAttributes: string[] = attributes.filter(
                    (attr) => !candidateKeyAttributes.has(attr)
                );
                for (let i = 0; i < redundantFDs; i++) {
                    const determinantSize: number =
                        Math.floor(Math.random() * (attributes.length - 1)) + 1;
                    // Ensure at least one non-candidate attribute in the determinant to prevent new candidate keys
                    const determinant: string[] = [...candidateKeyAttributes]
                        .sort(() => 0.5 - Math.random())
                        .slice(0, determinantSize - 1);
                    determinant.push(
                        nonCandidateAttributes[
                            Math.floor(
                                Math.random() * nonCandidateAttributes.length
                            )
                        ]
                    );
                    const dependents: string[] = attributes.filter(
                        (attr) =>
                            !determinant.includes(attr) &&
                            !candidateKeyAttributes.has(attr)
                    );
                    fds.add([
                        determinant.join(""),
                        dependents[
                            Math.floor(Math.random() * dependents.length)
                        ],
                    ]);
                }
            });
        }

        const fdList: Array<[string, string]> = Array.from(fds);

        // randomize the order of the FDs
        fdList.sort(() => 0.5 - Math.random());
        return fdList;
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
        // Get information on difficulty from JSON file where value = difficulty
        const difficultyInfo = difficultyData.difficulty_levels[difficulty];

        // Randomly choose number of attributes between min and max
        const noAttributes =
            Math.floor(
                Math.random() *
                    (difficultyInfo.max_attributes -
                        difficultyInfo.min_attributes +
                        1)
            ) + difficultyInfo.min_attributes;

        // Generate functional dependencies based on difficulty
        const tempFDs = generateFDs(noAttributes, difficultyInfo);

        setMatchInfo({
            totalNoOfCandidateKeys: difficultyInfo.candidate_keys,
            candidateNoOfKeysFound: 0,
            currMonstersUsed: 0,
            currRoundNumber: 1,
            totalRounds: difficultyInfo.rounds,
            noOfAttributes: noAttributes,
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
