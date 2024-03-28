import React, { useState, useEffect } from "react";
import {
    GameInfoContext,
    GameInfoContextType,
} from "../../../hooks/GameInfoProvider";
import { Grid } from "@mui/material";

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
        // replay animation on next match
        setTrainerFilePath(
            require(`../../../assets/Trainers/${props.trainerName}.gif`)
        );
    }, [matchInfo?.currRoundNumber]);

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
                        alignItems="center"
                        justifyContent={
                            props.trainerIsOnRight ? "flex-end" : "flex-start"
                        }
                        sx={styles.rowContainer}
                    >
                        {props.monsters.map((monsterId, index) => {
                            if (index % MAX_ROWS === rowIndex) {
                                return (
                                    <Grid
                                        key={index}
                                        item
                                        xs={itemSize}
                                        zeroMinWidth
                                    >
                                        <img
                                            src={require(`../../../assets/monsters/${monsterId}.gif`)}
                                            alt={`monster ${monsterId}`}
                                            style={{
                                                ...styles.monsterImg,
                                                ...(props.flipSprites &&
                                                    styles.flipImg),
                                            }}
                                        />
                                    </Grid>
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
    monsterImg: {
        width: "100%",
        height: "100%",
        minHeight: "40px",
        objectFit: "cover",
        imageRendering: "pixelated",
    },
    rowContainer: {
        width: "100%",
        minHeight: "120px",
        // border: "1px solid black",
    },
    trainerImg: {
        width: "auto",
        height: "100%",
        objectFit: "cover",
        imageRendering: "pixelated",
    },
    teamContainer: {
        // border: "1px solid black",
        height: "auto",
        width: "50%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
    },
    flipImg: {
        transform: "scaleX(-1)",
    },
};

export default React.memo(Team);