import "./App.css";
import GameInfoProvider from "./hooks/GameInfoProvider";
import StartGameForm from "./sections/start_game/StartGameForm";
import ArenaSection from "./sections/arena_section";
import { useState } from "react";
import FunctionalDependencies from "./sections/info_section";
import Rules from "./sections/rules";

function App() {
    // Checks whether the form is submitted. If true, the form component is replaced with the game.
    const [isSubmitted, setSubmitted] = useState(false);

    if (isSubmitted) {
    }

    const renderGamePage = () => {
        return (
            <div className="App">
                <h1>Relax and Find the Key</h1>
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
                <h1>Relax and Find the Key</h1>
                <p>
                    Find the combination of monsters that can wipe your
                    opponent's team!
                </p>
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

export default App;
