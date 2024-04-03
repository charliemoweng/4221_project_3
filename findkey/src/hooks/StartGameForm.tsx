import { Button, MenuItem, Select } from "@mui/material";
import React, { useState } from "react";
import "./StartGameForm.css";
import { GameInfoContext, GameInfoContextType } from "./GameInfoProvider";

interface StartGameFormProps {
  isSubmitted: boolean;
  setSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
}

const StartGameForm: React.FC<StartGameFormProps> = ({
  isSubmitted,
  setSubmitted,
}) => {
  const [difficulty, setDifficulty] = useState("0");
  const { handleNewMatch } = React.useContext(
    GameInfoContext
  ) as GameInfoContextType;

  function handleSubmit(event: { preventDefault: () => void }) {
    event.preventDefault();
    setSubmitted(true);
    handleNewMatch(parseInt(difficulty));
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h2>Choose your difficulty level:</h2>
        <Select
          id="demo-simple-select-outlined"
          className="select"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
        >
          <MenuItem value="0">Very Easy</MenuItem>
          <MenuItem value="1">Easy</MenuItem>
          <MenuItem value="2">Medium</MenuItem>
          <MenuItem value="3">Hard</MenuItem>
          <MenuItem value="4">Very Hard</MenuItem>
        </Select>
        <Button variant="outlined" type="submit">
          Start Game
        </Button>
      </form>
    </div>
  );
};

export default StartGameForm;
