import React from "react";
import { MusicSheet } from "./components/MusicSheet";
import styled from "styled-components";
import { treble, notes, bass } from "./notePostion";
import { Title } from "./components/Title";
import { Instructions } from "./components/Instructions";
import { Score } from "./components/Score";
import { Message } from "./components/Message";
import { ClefToggle } from "./components/ClefToggle";

const AppContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

interface IState {
  index: number;
  answer: string;
  streak: number;
  correct?: boolean;
  clefType: "treble" | "bass";
  hiScore: number;
}

class App extends React.Component<{}, IState> {
  state: IState = {
    hiScore: 0,
    index: Math.floor(Math.random() * treble.length),
    answer: "",
    streak: 0,
    correct: undefined,
    clefType: "treble",
  };

  constructor(props: {}) {
    super(props);
    document.onkeydown = (event) => {
      const upperKey = event.key?.toLocaleUpperCase("en");
      if (notes.includes(upperKey)) {
        this.checkInputToNote(upperKey);
      }
    };
  }

  componentDidMount = () => {
    this.loadHiScore();
  };

  loadHiScore = () => {
    const cookies = document.cookie.split(";");
    cookies.forEach((cookie) => {
      const [key, value] = cookie.split("=");
      if (key.trim() === "learnMusic") {
        this.setState({
          hiScore: parseInt(value),
        });
      }
    });
  };

  getRandomNoteIndex = (): number => {
    let noteLength = 0;
    if (this.state.clefType === "treble") {
      noteLength = treble.length;
    } else {
      noteLength = bass.length;
    }
    const nextNote = Math.floor(Math.random() * noteLength);
    if (nextNote === this.state.index) {
      return this.getRandomNoteIndex();
    }
    return nextNote;
  };

  isInputValidNote = (input: string | undefined): boolean => {
    if (input) {
      return notes.includes(input.toLocaleUpperCase("en"));
    }
    return false;
  };

  checkInputToNote = (key: string) => {
    if (this.isInputValidNote(key)) {
      this.setState(
        {
          answer: key,
        },
        this.handleScore
      );
    }
  };

  handleScore = () => {
    if (this.isInputCorrectNote(this.state.answer)) {
      const nextNote = this.getRandomNoteIndex();
      this.setState(
        (prevState) => ({
          index: nextNote,
          correct: true,
          streak: prevState.streak + 1,
        }),
        () => {
          if (this.state.streak > this.state.hiScore) {
            document.cookie = `learnMusic=${this.state.streak}`;
            this.setState((prevState) => ({ hiScore: prevState.streak }));
          }
        }
      );
    } else {
      this.setState({ correct: false, streak: 0 });
    }
  };

  switchClefType = (clefType: "treble" | "bass") => () => {
    this.setState({
      clefType,
      streak: 0,
      correct: undefined,
      index: this.getRandomNoteIndex(),
    });
  };

  isInputCorrectNote = (answer: string) => {
    if (this.state.clefType === "treble") {
      return answer === treble[this.state.index];
    } else {
      return answer === bass[this.state.index];
    }
  };

  render = () => {
    return (
      <>
        <Score streak={this.state.streak} hiScore={this.state.hiScore} />
        <Title />
        <ClefToggle
          activeClef={this.state.clefType}
          switchClefType={this.switchClefType}
        />
        <AppContainer>
          <MusicSheet clefType={this.state.clefType} index={this.state.index} />
        </AppContainer>
        <Instructions />
        <Message correct={this.state.correct} streak={this.state.streak} />
      </>
    );
  };
}

export default App;
