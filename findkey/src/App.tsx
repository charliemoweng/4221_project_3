import "./App.css";
import GameInfoProvider from "./hooks/GameInfoProvider";
import ArenaSection from "./sections/arena_section";

function App() {
    return (
        <GameInfoProvider>
            <div className="App">
                <ArenaSection />
            </div>
        </GameInfoProvider>
    );
}

export default App;
