import "./App.css";
import GameInfoProvider from "./hooks/GameInfoProvider";
import StartGameForm from "./hooks/StartGameForm";
import ArenaSection from "./sections/arena_section";
import { useState } from "react";

function App() {
    // Checks whether the form is submitted. If true, the form component is replaced with the game.
    const [isSubmitted, setSubmitted] = useState(false);

    const handleFormSubmit = () => {
        // can call 'backend' API here
    };

    if (isSubmitted) {
        return (
            <div className="App">
                <h1>Relax and Find the Key</h1>
            <GameInfoProvider>
            <div>
                <ArenaSection />
            </div>
            </GameInfoProvider>
            </div>
        )
    }

    return (
        <div className="landing">
            <h1>Relax and Find the Key</h1>
            <p>Goal: use the least number of monsters to kill the opponent's team. The least number of monsters is the candidate key of the set.
            </p>
            <div className="rulesForm">
                <div className="rules"><h2>Rules</h2>
                <ul>
                    <li>A monster of the same variant can always kill each other. A -&gt; A (reflexivity rule)</li>
                    <li>If A -&gt; BC, then monster A can kill monster B and C</li>
                    <li>If the closure calculated for A is the set (A, B, C, D), then monster A can kill the opponent’s monsters A, B, C and D.</li>
                </ul></div>
                <div className="form">
                <StartGameForm isSubmitted={isSubmitted} setSubmitted={setSubmitted} onFormSubmit={handleFormSubmit}></StartGameForm></div>
            </div>
        </div>

    );
}

export default App;
