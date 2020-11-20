import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import shuffle from "lodash/shuffle";
import range from "lodash/range";
import writtenNumber from "written-number";

const max = 500;

function getRandNumber() {
  return shuffle(range(0, max));
}

let voices: SpeechSynthesisVoice[] | null = null;

window.speechSynthesis.onvoiceschanged = () => {
  voices = window.speechSynthesis
    .getVoices()
    .filter((voice) => voice.lang === "fr-FR");
};

function say(text: string) {
  return new Promise((resolve) => {
    var msg = new SpeechSynthesisUtterance();
    msg.text = text;
    msg.onend = resolve;

    if (voices) {
      msg.voice = voices[voices.length - 1];
    }

    window.speechSynthesis.speak(msg);
  });
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100vw",
    height: "100vh",
  },
  number: {
    fontFamily: '"Cursive standard"',
  },
}));

function App() {
  const [mode, setMode] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [randNumbers, setRandNumbers] = useState(getRandNumber());
  const classes = useStyles();

  useEffect(() => {
    const increment = async (event: KeyboardEvent) => {
      if (event.code !== "Space") {
        return;
      }

      if (currentIndex >= 0) {
        await say(writtenNumber(randNumbers[currentIndex], { lang: "fr" }));
      }

      if (currentIndex + 1 === randNumbers.length) {
        setRandNumbers(getRandNumber());
        setMode(mode === 1 ? 0 : 1);
        setCurrentIndex(0);
      } else {
        setCurrentIndex(currentIndex + 1);
      }
    };

    window.addEventListener("keydown", increment);

    return () => {
      window.removeEventListener("keydown", increment);
    };
  }, [currentIndex, mode, randNumbers]);

  if (currentIndex === -1) {
    return null;
  }

  const text =
    mode === 1
      ? randNumbers[currentIndex]
      : writtenNumber(randNumbers[currentIndex], { lang: "fr" });

  const fontSize = Math.min(8, 120 / text.length);

  return (
    <div className={classes.root}>
      <span
        className={classes.number}
        style={{
          fontSize: fontSize + "vw",
        }}
      >
        {text}
      </span>
    </div>
  );
}

export default App;
