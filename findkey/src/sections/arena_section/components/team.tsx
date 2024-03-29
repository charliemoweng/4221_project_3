import React, { useState, useEffect } from "react";
import {
    GameInfoContext,
    GameInfoContextType,
} from "../../../hooks/GameInfoProvider";
import { Grid, Typography } from "@mui/material";

type Props = {
    style?: any;

    teamSize: number;

    trainerName: string;

    flipSprites: boolean;

    trainerIsOnRight: boolean;

    monsters: string[];

    deadMonsters?: Set<string>;
};

const Team = (props: Props) => {
    const { matchInfo } = React.useContext(
        GameInfoContext
    ) as GameInfoContextType;

    const [trainerFilePath, setTrainerFilePath] = useState<string>("");

    useEffect(() => {
        // force re-render of gif so animation plays
        setTrainerFilePath("");
        setTimeout(() => {
            setTrainerFilePath(
                require(`../../../assets/Trainers/${props.trainerName}.gif`)
            );
        }, 0);
    }, [props.trainerName, matchInfo?.currRoundNumber]);

    const renderMonster = (
        monsterId: string,
        index: number,
        itemSize: number
    ) => {
        return (
            <Grid key={index} item xs={itemSize} sx={styles.monsterContainer}>
                {props.deadMonsters?.has(monsterId) ? (
                    <img
                        src={require(`../../../assets/grave.png`)}
                        alt={`monster ${monsterId} died`}
                        style={{
                            ...styles.monsterImg,
                        }}
                    />
                ) : (
                    <img
                        src={require(`../../../assets/monsters/${monsterId}.gif`)}
                        alt={`monster ${monsterId}`}
                        style={{
                            ...styles.monsterImg,
                            ...(props.flipSprites && styles.flipImg),
                        }}
                    />
                )}
                <Typography sx={styles.monsterName}>{monsterId}</Typography>
            </Grid>
        );
    };

    const renderTeam = () => {
        const MAX_ROWS = 2;
        const itemSize = 12 / (props.teamSize / 2); // total grid size is 12 unity

        return (
            <div style={styles.teamContainer}>
                {[...Array(MAX_ROWS)].map((_, rowIndex) => (
                    <Grid
                        key={rowIndex}
                        container
                        direction="row"
                        alignItems="stretch"
                        justifyContent={
                            props.trainerIsOnRight ? "flex-end" : "flex-start"
                        }
                        sx={styles.rowContainer}
                    >
                        {props.monsters.map((monsterId, index) => {
                            if (index % MAX_ROWS === rowIndex) {
                                return renderMonster(
                                    monsterId,
                                    index,
                                    itemSize
                                );
                            }
                            return null;
                        })}
                    </Grid>
                ))}
            </div>
        );
    };

    const renderTrainer = () => {
        return (
            <img
                src={trainerFilePath}
                alt="Trainer"
                style={{
                    ...styles.trainerImg,
                    ...(props.flipSprites && styles.flipImg),
                }}
            />
        );
    };

    return (
        <div
            style={{
                ...styles.mainContainer,
                justifyContent: props.trainerIsOnRight
                    ? "flex-end"
                    : "flex-start",
            }}
        >
            {!props.trainerIsOnRight && renderTrainer()}
            {renderTeam()}
            {props.trainerIsOnRight && renderTrainer()}
        </div>
    );
};

const styles: any = {
    mainContainer: {
        display: "flex",
        direction: "row",
        alignItems: "center",
        // border: "1px solid black",
        width: "50%",
        height: "auto",
    },
    teamContainer: {
        height: "auto",
        width: "60%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
    },
    rowContainer: {
        width: "100%",
        minHeight: "170px",
    },
    monsterContainer: {
        position: "relative",
        display: "flex",
        alignItems: "center",
    },
    monsterImg: {
        width: "100%",
        height: "100%",
        minHeight: "40px",
        objectFit: "contain",
        imageRendering: "pixelated",
    },
    monsterName: {
        position: "absolute",
        bottom: 0,
        right: 0,
        fontWeight: "bold",
        fontSize: "20px",
    },
    trainerImg: {
        width: "auto",
        height: "100%",
        objectFit: "contain",
        imageRendering: "pixelated",
    },
    flipImg: {
        transform: "scaleX(-1)",
    },
};

export default React.memo(Team);
