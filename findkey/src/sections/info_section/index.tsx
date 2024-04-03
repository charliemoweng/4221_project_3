import React, { useState, useMemo, useEffect } from "react";
import {
    GameInfoContext,
    GameInfoContextType,
} from "../../hooks/GameInfoProvider";
import { Grid, Typography, Tooltip, IconButton, Box } from "@mui/material";
import FunctionalDependency from "./components/functionalDependency";
import Closure from "./components/closure";
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
                    return (
                        <Grid item key={index} xs={12} sm={6} md={4}>
                            <FunctionalDependency functionalDependency={pair} />
                        </Grid>
                    );
                })}
            </Grid>
        );
    };

    const displayClosures = () => {
        return (
            <Box sx={styles.closureContainer}>
                {matchInfo &&
                    Array.from(matchInfo.closuresOfSetsUsed).map(
                        ([key, value]) => {
                            return (
                                <Box sx={{ marginRight: "50px" }}>
                                    <Closure closure={[key, value]} />
                                </Box>
                            );
                        }
                    )}
            </Box>
        );
    };

    const displayTooltip = (innerTyping: any) => {
        return (
            <Tooltip
                title={innerTyping}
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
        );
    };

    const displayMatchupSection = () => {
        return (
            <div style={styles.matchupContainer}>
                <div style={{ ...styles.header, marginBottom: "20px" }}>
                    <Typography
                        align="center"
                        variant="h4"
                        sx={{ ...styles.heading }}
                    >
                        Monster Matchups
                    </Typography>
                    {displayTooltip(
                        <Typography
                            style={{
                                fontSize: "13px",
                                textAlign: "center",
                            }}
                        >
                            Matchup of monsters on the <b>left</b> will defeat
                            the ones on the <b>right</b>.
                            <br />
                            Find the right team to defeat all!
                        </Typography>
                    )}
                </div>
                {displayFDs()}
            </div>
        );
    };

    const displayClosuresSection = () => {
        return (
            <div style={styles.closureSectionContainer}>
                <div style={{ ...styles.header, marginBottom: "10px" }}>
                    <Typography variant="h5" sx={{ ...styles.heading }}>
                        Previous teams
                    </Typography>
                    {displayTooltip(
                        <Typography
                            style={{
                                fontSize: "13px",
                                textAlign: "center",
                            }}
                        >
                            Team combinations you selected previously and their
                            matchups.
                        </Typography>
                    )}
                </div>
                {displayClosures()}
            </div>
        );
    };

    return (
        <div style={styles.mainContainer}>
            {displayMatchupSection()}
            {displayClosuresSection()}
        </div>
    );
};

const styles: any = {
    mainContainer: {
        padding: "0px 50px",
    },
    matchupContainer: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
    },
    closureSectionContainer: {
        marginTop: "30px",
    },
    header: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
    },
    closureContainer: {
        minHeight: "128px",
        display: "flex",
        width: "100%",
        flexWrap: "wrap",
    },
};

export default React.memo(FunctionalDependencies);
