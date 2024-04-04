import React, { useState, useMemo, useEffect } from "react";
import {
    Button,
    Dialog,
    Slide,
    DialogTitle,
    DialogContentText,
    DialogActions,
    DialogContent,
    Select,
    MenuItem,
    Typography,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import { MatchInfo } from "../../../hooks/GameInfoProvider";

type Props = {
    isOpen: boolean;
    isWin: boolean;
    totalMonsterCount: number;
    totalRoundsUsed: number;
    combinationsFound: number;
    totalCombinations: number;
    onStartNewGame: (difficulty: number) => void;
};

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const MatchEndDialogue = (props: Props) => {
    const [difficulty, setDifficulty] = useState("0");

    const renderStats = () => {
        return (
            <DialogContentText sx={[{ marginTop: "30px" }]}>
                <Typography sx={styles.mainText}>
                    <b>How you did:</b>
                </Typography>
                <Typography>
                    You used a total of <b>{props.totalMonsterCount}</b>{" "}
                    {props.totalMonsterCount === 1 ? "monster" : "monsters"}
                </Typography>
                {props.isWin ? (
                    <Typography>
                        You found <b>all</b> team combinations that can wipe the
                        enemy's team!
                    </Typography>
                ) : (
                    <Typography>
                        You found <b>{props.combinationsFound}</b> team
                        combinations that can wipe the enemy's team. But you are
                        missing{" "}
                        <b>
                            {props.totalCombinations - props.combinationsFound}
                        </b>{" "}
                        other combinations.
                    </Typography>
                )}
                {props.isWin && (
                    <Typography>
                        You used a total of <b>{props.totalRoundsUsed}</b>{" "}
                        {props.totalRoundsUsed === 1 ? "round" : "rounds"} to
                        find all the combinations!
                    </Typography>
                )}
            </DialogContentText>
        );
    };

    const handleNewGame = () => {
        props.onStartNewGame(parseInt(difficulty));
        setDifficulty("0");
    };

    return (
        <Dialog
            open={props.isOpen}
            onClose={() => {}}
            TransitionComponent={Transition}
            PaperProps={{
                sx: {
                    minHeight: "400px",
                },
            }}
        >
            <DialogTitle sx={styles.headerTitle}>Match End</DialogTitle>
            <DialogContent>
                {props.isWin ? (
                    <DialogContentText sx={styles.mainText}>
                        <b>Congrats!</b> You found all the different
                        combinations to wiped the enemy's team within the number
                        of rounds!
                    </DialogContentText>
                ) : (
                    <DialogContentText sx={styles.mainText}>
                        You were not able to find all the different combinations
                        that can wipe the enemy's team in the allocated number
                        of rounds. <b>Try again next time!</b>
                    </DialogContentText>
                )}

                {renderStats()}
            </DialogContent>
            <DialogActions sx={styles.bottomContainer}>
                <Typography sx={{ fontSize: "20px" }}>
                    <b>Play again:</b>
                </Typography>
                <Select
                    sx={{ ...styles.buttonHeight, minWidth: "150px" }}
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                >
                    <MenuItem value="0">Very Easy</MenuItem>
                    <MenuItem value="1">Easy</MenuItem>
                    <MenuItem value="2">Medium</MenuItem>
                    <MenuItem value="3">Hard</MenuItem>
                    <MenuItem value="4">Very Hard</MenuItem>
                </Select>
                <Button
                    variant="contained"
                    sx={styles.buttonHeight}
                    onClick={handleNewGame}
                >
                    New Match
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default React.memo(MatchEndDialogue);

const styles: any = {
    dialogueContainer: {
        minHeight: "850px",
    },
    headerTitle: {
        textAlign: "center",
        fontSize: "30px",
        fontWeight: "bold",
    },
    mainText: {
        fontSize: "18px",
    },
    bottomContainer: {
        display: "flex",
        height: "auto",
    },
    buttonHeight: {
        height: "50px",
    },
};
