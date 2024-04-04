import React from "react";
import { Typography, Box } from "@mui/material";

type Props = {
    functionalDependency: [string, string];
    maxHeight?: string;
    monsterHeight?: string;
    pointerHeight?: string;
};

const MAX_HEIGHT = "55px";
const MONSTER_HEIGHT = "40px";
const POINTER_HEIGHT = "19px";

const FunctionalDependency = ({
    maxHeight = MAX_HEIGHT,
    monsterHeight = MONSTER_HEIGHT,
    pointerHeight = POINTER_HEIGHT,
    ...props
}: Props) => {
    const renderMonster = (monsterId: string, index: number) => {
        return (
            <Box sx={styles.monsterContainer} key={index}>
                <img
                    src={require(`../../../assets/monsters/${monsterId}.gif`)}
                    alt={`monster ${monsterId}`}
                    style={{
                        ...styles.img,
                        height: monsterHeight,
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
                    src={require(`../../../assets/sword.png`)}
                    alt={`vs sword`}
                    style={{
                        ...styles.img,
                        height: maxHeight,
                    }}
                />
            </Box>
        );
    };

    const displayFD = () => {
        const [LHS, RHS] = props.functionalDependency;
        const LHSMonsters = [...LHS];
        const RHSMonsters = [...RHS];

        return (
            <Box sx={[styles.mainContainer, { height: MAX_HEIGHT }]}>
                <img
                    src={require(`../../../assets/Pointers/pokeball.png`)}
                    alt={`pokeball icon`}
                    style={{
                        ...styles.img,
                        height: pointerHeight,
                    }}
                />
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
        padding: "0px 10px",
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
        fontSize: "15px",
        position: "absolute",
    },
};

export default React.memo(FunctionalDependency);
