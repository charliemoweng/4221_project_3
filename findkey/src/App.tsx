import "./App.css";
import GameInfoProvider from "./hooks/GameInfoProvider";
import StartGameForm from "./sections/start_game/StartGameForm";
import ArenaSection from "./sections/arena_section";
import { useState } from "react";
import FunctionalDependencies from "./sections/info_section";
import Rules from "./sections/rules";
import { Typography } from "@mui/material";

function App() {
    // Checks whether the form is submitted. If true, the form component is replaced with the game.
    const [isSubmitted, setSubmitted] = useState(false);

    const renderTitle = () => {
        return (
            <div style={{ marginTop: "20px", marginBottom: "30px" }}>
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <img
                        src={require(`./assets/pikachu1.png`)}
                        alt={`pikachu`}
                        style={{ ...styles.titleIcon, transform: "scaleX(-1)" }}
                    />
                    <Typography sx={{ fontWeight: "bold", fontSize: "40px" }}>
                        Monster Dependencies
                    </Typography>
                    <img
                        src={require(`./assets/pikachu3.png`)}
                        alt={`pikachu`}
                        style={styles.titleIcon}
                    />
                </div>
                <Typography variant="h6" align="center">
                    Find the combination of monsters that can wipe your
                    opponent's team!
                </Typography>
            </div>
        );
    };

    const renderGamePage = () => {
        return (
            <div className="App">
                {renderTitle()}
                <div>
                    <FunctionalDependencies></FunctionalDependencies>
                    <hr></hr>
                </div>
                <ArenaSection />
            </div>
        );
    };

    const renderLandingPage = () => {
        return (
            <div className="landing">
                {renderTitle()}
                <div className="rulesForm">
                    <Rules />
                    <div className="form">
                        <StartGameForm
                            isSubmitted={isSubmitted}
                            setSubmitted={setSubmitted}
                        ></StartGameForm>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div>
            <GameInfoProvider>
                {isSubmitted ? renderGamePage() : renderLandingPage()}
            </GameInfoProvider>
        </div>
    );
}

const styles: any = {
    titleIcon: {
        width: "45px",
        height: "auto",
        objectFit: "contain",
        imageRendering: "pixelated",
        margin: "0px 20px",
    },
};

export default App;
