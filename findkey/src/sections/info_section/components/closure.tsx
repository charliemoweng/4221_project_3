import React from "react";
import { Typography, Box } from "@mui/material";

type Props = {
    closure: [string, string];
    maxHeight?: string;
    monsterHeight?: string;
    pointerHeight?: string;
    showPointer?: boolean;
    totalAttributes?: number;
};

const MAX_HEIGHT = "36px";
const MONSTER_HEIGHT = "30px";
const POINTER_HEIGHT = "18px";

const Closure = ({
    maxHeight = MAX_HEIGHT,
    monsterHeight = MONSTER_HEIGHT,
    pointerHeight = POINTER_HEIGHT,
    showPointer = true,
    ...props
}: Props) => {
    const renderMonster = (monsterId: string, index: number) => {
        return (
            <Box sx={styles.monsterContainer} key={index}>
                <img
                    src={require(`../../../assets/monsters/${monsterId}.png`)}
                    alt={`monster ${monsterId}`}
                    style={{
                        ...styles.img,
                        height: MONSTER_HEIGHT,
                    }}
                />
                <Typography sx={styles.monsterName}>{monsterId}</Typography>
            </Box>
        );
    };

    const renderArrow = () => {
        return (
            <Box>
                <img
                    src={require(`../../../assets/sword_sprite.png`)}
                    alt={`vs sword`}
                    style={{
                        ...styles.img,
                        height: MAX_HEIGHT,
                        margin: "0px 7px",
                        rotate: "-43deg",
                    }}
                />
            </Box>
        );
    };

    const displayFD = () => {
        const [LHS, RHS] = props.closure;
        const LHSMonsters = [...LHS];
        const RHSMonsters = [...RHS];

        return (
            <Box sx={[styles.mainContainer, { height: MAX_HEIGHT }]}>
                {showPointer &&
                    (props.totalAttributes === RHSMonsters.length ? (
                        <img
                            src={require(`../../../assets/Pointers/master.png`)}
                            alt={`master ball icon`}
                            style={{
                                ...styles.img,
                                height: POINTER_HEIGHT,
                                marginRight: "5px",
                            }}
                        />
                    ) : (
                        <img
                            src={require(`../../../assets/Pointers/pokeball.png`)}
                            alt={`pokeball icon`}
                            style={{
                                ...styles.img,
                                height: POINTER_HEIGHT,
                                marginRight: "5px",
                            }}
                        />
                    ))}
                {LHSMonsters.map((monster, i) => {
                    return renderMonster(monster, i);
                })}
                {renderArrow()}
                {RHSMonsters.map((monster, i) => {
                    return renderMonster(monster, i);
                })}
            </Box>
        );
    };

    return <div>{displayFD()}</div>;
};

const styles: any = {
    mainContainer: {
        display: "flex",
        flexDirection: "row",
        width: "auto",
        alignItems: "center",
    },
    monsterContainer: {
        position: "relative",
        display: "flex",
        height: "100%",
        padding: "0px 3px",
        alignItems: "center",
    },
    img: {
        width: "auto",
        objectFit: "contain",
        imageRendering: "pixelated",
    },
    monsterName: {
        bottom: 0,
        right: 0,
        fontWeight: "bold",
        fontSize: "8px",
        position: "absolute",
    },
};

export default React.memo(Closure);
