import React, { useState } from "react";
import { Box, Button } from "@mui/material";

type Props = {
    style?: any;
    isSelected: boolean;
    isDisabled: boolean;
    id: string;
    onClick: (id: string) => void;
};

const MonsterSelectionButton = (props: Props) => {
    const [isHovered, setIsHovered] = useState(false);
    const handleMouseHover = (isHover: boolean) => {
        setIsHovered(isHover);
    };

    return (
        <Button
            sx={[
                styles.button,
                props.isSelected
                    ? styles.isSelectedButton
                    : styles.isNotSelectedButton,
                props.style,
            ]}
            disabled={props.isDisabled}
            onClick={() => props.onClick(props.id)}
            onMouseEnter={() => handleMouseHover(true)}
            onMouseLeave={() => handleMouseHover(false)}
        >
            {props.isSelected && (
                <Box sx={[styles.overlay, isHovered && styles.overlayHover]} />
            )}
            <img
                src={require(`../../../assets/monsters/${props.id}.gif`)}
                style={styles.monsterImg}
                alt={`Monster type ${props.id}`}
            />
        </Button>
    );
};

const styles: any = {
    monsterImg: {
        width: "100%",
        height: "100%",
        maxWidth: "100%",
        maxHeight: "100%",
        objectFit: "contain",
        imageRendering: "pixelated",
    },
    button: {
        backgroundColor: "rgba(255,255,255,1)",
        overflow: "hidden",
    },
    isSelectedButton: {
        ":hover": {
            backgroundColor: "rgba(255,255,255,1)",
        },
    },
    isNotSelectedButton: {
        ":hover": {
            backgroundColor: "rgba(0,0,0, 0.05)",
        },
    },
    overlay: {
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        pointerEvents: "none", // Ensure the overlay doesn't block interaction with the image
    },
    overlayHover: {
        backgroundColor: "rgba(0, 0, 0, 0.4)",
    },
};

export default React.memo(MonsterSelectionButton);
