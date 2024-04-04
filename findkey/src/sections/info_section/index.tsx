import React from "react";
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
                                <Box
                                    sx={{
                                        marginRight: "50px",
                                        marginBottom: "35px",
                                    }}
                                    key={key}
                                >
                                    <Closure
                                        closure={[key, value]}
                                        totalAttributes={
                                            matchInfo.noOfAttributes
                                        }
                                    />
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
                        <b>Monster Matchups</b>
                    </Typography>
                    {displayTooltip(
                        <Typography
                            style={{
                                fontSize: "13px",
                                textAlign: "center",
                            }}
                        >
                            Matchup of monsters on the <b>left</b> will be
                            stronger than the ones on the <b>right</b>.
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
                        <b>Previous teams</b>
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

    const displayGameStates = () => {
        return (
            <div style={styles.gameStateContainer}>
                <Typography variant="h6">
                    <b>Round: </b>
                    {matchInfo?.currRoundNumber} / {matchInfo?.totalRounds}
                </Typography>

                <Typography variant="h6">
                    <b>Monsters Used: </b>
                    {matchInfo?.currMonstersUsed}
                </Typography>

                <Typography variant="h6">
                    <b>Team Combinations Found: </b>
                    {matchInfo?.candidateNoOfKeysFound} /{" "}
                    {matchInfo?.totalNoOfCandidateKeys}
                </Typography>
            </div>
        );
    };

    return (
        <div style={styles.mainContainer}>
            {displayMatchupSection()}
            {displayClosuresSection()}
            {displayGameStates()}
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
        minHeight: "300px",
    },
    header: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
    },
    closureContainer: {
        display: "flex",
        width: "100%",
        flexWrap: "wrap",
    },
    gameStateContainer: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-evenly",
    },
};

export default React.memo(FunctionalDependencies);
