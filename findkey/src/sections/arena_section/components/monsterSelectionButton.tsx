import React from "react";
import { Box, Button, Typography } from "@mui/material";

type Props = {
    isSelected: boolean;
    id: string;
    onClick: (id: string) => void;
};

const MonsterSelectionButton = (props: Props) => {
    return <Button>Hello</Button>;
};

export default React.memo(MonsterSelectionButton);
