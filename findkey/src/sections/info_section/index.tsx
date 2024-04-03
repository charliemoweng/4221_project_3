import React, { useState, useMemo, useEffect } from "react";
import {
    GameInfoContext,
    GameInfoContextType,
} from "../../hooks/GameInfoProvider";
import { Grid, Typography, Tooltip, IconButton } from "@mui/material";
import FunctionalDependency from "./components/functionalDependency";
import { FaInfoCircle } from "react-icons/fa";

type Props = {};

const FunctionalDependencies = (props: Props) => {
    const { matchInfo } = React.useContext(
        GameInfoContext
    ) as GameInfoContextType;

    const displayFDs = () => {
        return (
            <Grid container>
                {matchInfo?.functionalDependencies.map((pair, index) => {
                    const [LHS, RHS] = pair;

                    return (
                        <Grid item key={index} xs={12} sm={6} md={4}>
                            <FunctionalDependency
                                functionalDependency={pair}
                                index={index}
                            />
                        </Grid>
                    );
                })}
            </Grid>
        );
    };

    return (
        <div style={styles.mainContainer}>
            <div style={styles.header}>
                <Typography variant="h4" sx={{ ...styles.heading }}>
                    Monster Matchups
                </Typography>
                <Tooltip
                    title={
                        <Typography
                            style={{ fontSize: "13px", textAlign: "center" }}
                        >
                            Matchup of monsters on the <b>left</b> will defeat
                            the ones on the <b>right</b>.
                            <br />
                            Find the right team to defeat all!
                        </Typography>
                    }
                    slotProps={{
                        popper: {
                            modifiers: [
                                {
                                    name: "offset",
                                    options: {
                                        offset: [0, -14],
                                    },
                                },
                            ],
                        },
                    }}
                >
                    <IconButton>
                        <FaInfoCircle />
                    </IconButton>
                </Tooltip>
            </div>
            {displayFDs()}
        </div>
    );
};

const styles: any = {
    mainContainer: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
    },
    header: {
        display: "flex",
        flexDirection: "row",
        marginBottom: "20px",
    },
    heading: {},
};

export default React.memo(FunctionalDependencies);
