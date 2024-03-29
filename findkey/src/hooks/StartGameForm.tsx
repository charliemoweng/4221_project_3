import { Button, InputLabel, MenuItem, Select } from "@mui/material";
import React, { useState } from "react";
import "./StartGameForm.css";

interface StartGameFormProps {
    isSubmitted: boolean;
    setSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
    onFormSubmit: () => void;
  }

const StartGameForm: React.FC<StartGameFormProps> = ({isSubmitted, setSubmitted, onFormSubmit}) => {
    const [difficulty, setDifficulty] = useState('1');
    
    function handleSubmit(event: { preventDefault: () => void; }) {
        event.preventDefault();
        console.log(difficulty);
        setSubmitted(true);
        onFormSubmit(); // Call the function passed from the parent
    }

    return (
        <div>
        <form onSubmit={handleSubmit}>
        <h2>Choose your difficulty level:</h2>
            <Select id="demo-simple-select-outlined"
                    className="select"
                    value={difficulty} 
                    onChange={e=>setDifficulty(e.target.value)}>
            <MenuItem value="1">Easy</MenuItem>
            <MenuItem value="2">Medium</MenuItem>
            <MenuItem value="3">Hard</MenuItem>
            </Select>
            <Button variant="outlined" type ="submit">Start Game</Button>
        </form>
        </div>
    );
}


export default StartGameForm;