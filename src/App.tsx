import React, { useEffect, useState } from "react";
import { useLocalStorage } from "react-use";
import { makeStyles } from "@material-ui/core/styles";
import shuffle from "lodash/shuffle";
import _range from "lodash/range";
import writtenNumber from "written-number";
import Settings from "./Settings";
import { Config } from "./types";

function getRandNumber(range: [number, number]) {
  return shuffle(_range(range[0], range[1] + 1));
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
    position: "fixed",
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

const defaultConfig: Config = {
  range: [0, 20],
};

function App() {
  const [config = defaultConfig, setConfig] = useLocalStorage<Config>(
    "config",
    defaultConfig
  );

  const [started, setStarted] = useState(false);
  const [mode, setMode] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [randNumbers, setRandNumbers] = useState(getRandNumber(config.range));
  const classes = useStyles();

  useEffect(() => {
    if (!started) {
      return () => {};
    }

    const increment = async (event: KeyboardEvent) => {
      if (event.code !== "Space") {
        return;
      }

      if (currentIndex >= 0) {
        await say(writtenNumber(randNumbers[currentIndex], { lang: "fr" }));
      }

      if (currentIndex + 1 === randNumbers.length) {
        setRandNumbers(getRandNumber(config.range));
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
  }, [config.range, currentIndex, mode, randNumbers, started]);

  const text =
    mode === 1
      ? randNumbers[currentIndex]
      : writtenNumber(randNumbers[currentIndex], { lang: "fr" });

  const fontSize = Math.min(8, 120 / text.length);

  return (
    <div className={classes.root}>
      {started ? (
        <span
          className={classes.number}
          style={{
            fontSize: fontSize + "vw",
          }}
        >
          {text}
        </span>
      ) : (
        <Settings
          range={config.range}
          onRangeChanged={(range) => {
            setConfig({ ...config, range });
          }}
          onSubmited={() => setStarted(true)}
        />
      )}
    </div>
  );
}

export default App;
