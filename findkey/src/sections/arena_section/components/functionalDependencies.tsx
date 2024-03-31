import React, { useState, useEffect } from "react";
import {
    GameInfoContext,
    GameInfoContextType,
} from "../../../hooks/GameInfoProvider";
import { Grid, Typography } from "@mui/material";

type Props = {
    monsters: string[];
};

const FunctionalDependencies = (props: Props) => {
    const { matchInfo } = React.useContext(GameInfoContext) as GameInfoContextType;

    const renderMonster = (
        monsterId: string,
        index: number,
        itemSize: number,
        count: number,
    ) => {
        return (
            // <Grid key={index} item xs={itemSize} sx={styles.monsterContainer}>
            <div key={index}>
                    <img
                        src={require(`../../../assets/grave.png`)}
                        alt={`monster ${monsterId} died`}
                        style={{
                            ...styles.monsterImg,
                        }}
                    />
                <Typography sx={styles.monsterName}>{monsterId}</Typography>
            </div>
            // </Grid>
        );
    };

    const displayFDs = (monsters: string[]) => {
        return ( 
            <div>
                {matchInfo?.functionalDependencies.map((pair, index)=>{
                    var count = 1;
                    const [LHS, RHS] = pair;
                    const LHSMonsters = [...LHS];
                    const RHSMonsters = [...RHS];
                    console.log("LHSMonster: " + LHSMonsters);
                    console.log("RHSMonster: " + RHSMonsters);

                    const elements = [];
                    for (let i = 0; i < LHSMonsters.length; i++) {
                        const currMonster = LHSMonsters[i];
                        const index = monsters.indexOf(currMonster);
                        elements.push(renderMonster(LHSMonsters[i], index, 2, count));
                        count++;
                    }
                    for (let i = 0; i < RHSMonsters.length; i++) {
                        const currMonster = RHSMonsters[i];
                        const index = monsters.indexOf(currMonster);
                        elements.push(renderMonster(RHSMonsters[i], index, 2, count));
                        count++
                    }
                    return elements;
                })}
            </div>
        )
    }

    return (
        <div style={styles.teamContainer}>
        <h2>Functional Dependencies</h2>
        {[...Array(2)].map((_, rowIndex) => (
            <Grid
                key={rowIndex}
                container
                direction="row"
                alignItems="stretch"
                justifyContent={"flex"}
                sx={styles.rowContainer}
            >
                {displayFDs(props.monsters)}
            </Grid>
        ))}
    </div>
    )
}

const styles: any = {
    monsterContainer: {
        position: "relative",
        display: "flex",
        alignItems: "center",
    },
}

export default React.memo(FunctionalDependencies);