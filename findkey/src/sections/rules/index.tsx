import React from "react";
import { Typography } from "@mui/material";
import Closure from "../info_section/components/closure";

const Rules = () => {
    return (
        <div style={styles.mainContainer}>
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <img
                    src={require(`../../assets/mimikyu.png`)}
                    alt={`vs sword`}
                    style={{ ...styles.titleIcon, transform: "scaleX(-1)" }}
                />
                <Typography sx={styles.title}>Rules</Typography>
                <img
                    src={require(`../../assets/pikachu2.png`)}
                    alt={`mimikyu`}
                    style={{ ...styles.titleIcon, width: "33px" }}
                />
            </div>
            <div style={styles.ruleContainer}>
                <div style={styles.ruleBox}>
                    <Typography sx={styles.ruleSubHeader}>
                        1. Strength Representation
                    </Typography>

                    <Typography align="left">
                        Indicates what combination of your monsters is needed to
                        defeat your opponent's. <br />
                        <br />
                        In this case, to defeat monster C, you need both A and B
                    </Typography>
                    <br />
                    <Closure closure={["AB", "C"]} showPointer={false} />
                </div>
                <div style={styles.ruleBox}>
                    <Typography sx={styles.ruleSubHeader}>
                        2. Reflexitivity
                    </Typography>
                    <Typography align="left">
                        For monsters of the same type, yours will always defeat
                        the opponent's.
                    </Typography>
                    <br />
                    <Closure closure={["A", "A"]} showPointer={false} />
                </div>
                <div style={styles.ruleBox}>
                    <Typography sx={styles.ruleSubHeader}>
                        3. Transitivity
                    </Typography>
                    <Typography align="left">
                        The strength of a monster can propogate.
                        <br />
                        <br />
                        For example, monster A and B can defeat C. C is able to
                        defeat D. Therefore, A and B will be able to defeat D
                        too.
                    </Typography>
                    <br />
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            // justifyContent: "center",
                            width: "100%",
                        }}
                    >
                        <div>
                            <Closure
                                closure={["AB", "C"]}
                                showPointer={false}
                            />
                            <Closure closure={["C", "D"]} showPointer={false} />
                        </div>
                        <img
                            src={require(`../../assets/arrow.png`)}
                            alt={`dependency arrow`}
                            style={{
                                width: "50px",
                                height: "auto",
                                margin: "0px 40px",
                            }}
                        />
                        <Closure closure={["AB", "D"]} showPointer={false} />
                    </div>
                </div>
                <div style={styles.ruleBox}>
                    <Typography sx={styles.ruleSubHeader}>
                        4. Using too many monsters
                    </Typography>
                    <Typography align="left">
                        If there is a valid subset within your current team you
                        could have ysed to wipe the enemy's team, your current
                        team would not be counted as a valid combination.
                        <br />
                        You must find the smallest possible subset to defeat the
                        enemy team.
                    </Typography>
                </div>
                <div style={styles.ruleBox}>
                    <Typography sx={styles.ruleSubHeader}>
                        5. Repetition
                    </Typography>
                    <Typography align="left">
                        You cannot repeat team combinations you have used before
                        in previous rounds.
                    </Typography>
                </div>
                <div style={styles.ruleBox}>
                    <Typography sx={styles.ruleSubHeader}>6. Goals</Typography>
                    <Typography align="left">
                        Find all the combinations of monsters that can
                        completely wipe your opponent's team with the least
                        amount of turns and monsters used.
                    </Typography>
                </div>
            </div>
        </div>
    );
};

const styles: any = {
    mainContainer: {
        width: "100%",
        border: "2px solid black",
        borderRadius: "10px",
        paddingBottom: "30px",
    },
    ruleContainer: {
        padding: "0px 30px",
    },
    ruleBox: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        marginTop: "30px",
    },
    ruleText: {
        textAlign: "left",
    },
    ruleSubHeader: {
        fontSize: "20px",
        fontWeight: "bold",
        textDecoration: "underline",
    },
    title: {
        fontSize: "30px",
        fontWeight: "bold",
    },
    titleIcon: {
        width: "25px",
        height: "auto",
        objectFit: "contain",
        imageRendering: "pixelated",
        margin: "0px 10px",
    },
};

export default React.memo(Rules);
