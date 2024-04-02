import React from "react";
import {
    GameInfoContext,
    GameInfoContextType,
} from "../../../hooks/GameInfoProvider";
import { Grid, Typography } from "@mui/material";

const FunctionalDependencies = () => {
    const { matchInfo } = React.useContext(GameInfoContext) as GameInfoContextType;

    const renderMonster = (
        monsterId: string,
        itemSize: number,
        count: number,
    ) => {
        return (
            <Grid key={count} item xs={itemSize} sx={styles.monsterContainer}>
                <img
                    src={require(`../../../assets/monsters/${monsterId}.gif`)}
                    alt={`monster ${monsterId}`}
                    style={{
                        ...styles.monsterImg,
                    }}
                />
                <Typography sx={styles.monsterName}>{monsterId}</Typography>
            </Grid>
        );
    };

    const renderArrow = (itemSize: number) => {
        return (
            <Grid key={0} item xs={itemSize} sx={styles.monsterContainer}>
                <img
                src={require(`../../../assets/arrow.png`)}
                alt={`arrow`}
                style={{
                    ...styles.monsterImg,
                }}
                />
            </Grid>
        )
    }

    const displayFDs = () => {
        return ( 
            <div>
                <Grid key={0} container direction="row" alignItems="stretch" sx={styles.rowContainer}>
                {matchInfo?.functionalDependencies.map((pair, index)=>{
                    var count = 1;
                    const [LHS, RHS] = pair;
                    const LHSMonsters = [...LHS];
                    const RHSMonsters = [...RHS];

                    const elements = [];
                    elements.push(<p>{index+1 + ". "}</p>);
                    for (let i = 0; i < LHSMonsters.length; i++) {
                        elements.push(renderMonster(LHSMonsters[i], 0.5, count));
                        count++;
                    }
                    elements.push(renderArrow(0.5));
                    for (let i = 0; i < RHSMonsters.length; i++) {
                        elements.push(renderMonster(RHSMonsters[i], 0.5, count));
                        count++;
                    }
                    return (
                    <Grid key={index} container direction="row" spacing={2}>
                    {elements}
                    </Grid>)
                })}
                </Grid>
            </div>
        )
    }

    return (
        <div>
        <p style={{...styles.heading}}>Functional Dependencies</p>
        <p style={{...styles.heading}}>Number of Monsters Used: {matchInfo?.currMonstersUsed}</p>
            {displayFDs()}
    </div>
    )
}

const styles: any = {
    monsterContainer: {
        position: "relative",
        display: "flex",
        alignItems: "center",
        margin: "10px",
    },
    rowContainer: {
        width: "100%",
        minHeight: "170px",
        padding: "20px",
        margin: "20px",
    },
    monsterImg: {
        width: "100%",
        height: "100%",
        minHeight: "40px",
        objectFit: "contain",
        imageRendering: "pixelated",
    },
    monsterName: {
        bottom: 0,
        right: 0,
        fontWeight: "bold",
        fontSize: "17px",
        padding: "5px",
    },
    heading: {
        display: "flex",
        textAlign: "left",
        marginLeft: "20px",
    }
}

export default React.memo(FunctionalDependencies);