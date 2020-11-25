import React, { useEffect, useState } from "react";
import { useLocalStorage } from "react-use";
import { makeStyles } from "@material-ui/core/styles";
import shuffle from "lodash/shuffle";
import createRange from "lodash/range";
import writtenNumber from "written-number";
import Settings from "./Settings";
import Toolbar from "./Toolbar";
import { Config, Range, SequencingMode } from "./types";

enum Version {
  literal,
  digital,
}

interface SerieItem {
  number: number;
  text: string;
}

type Serie = SerieItem[];

let voices: SpeechSynthesisVoice[] | null = null;

window.speechSynthesis.onvoiceschanged = () => {
  voices = window.speechSynthesis
    .getVoices()
    .filter((voice) => voice.lang === "fr-FR");
};

function say(text: number) {
  return new Promise((resolve) => {
    var msg = new SpeechSynthesisUtterance();
    msg.text = text + "";
    msg.onend = resolve;

    if (voices) {
      msg.voice = voices[voices.length - 1];
    }

    window.speechSynthesis.speak(msg);
  });
}

const createSerie = (
  range: Range,
  random: boolean = true,
  version: Version = Version.digital
): Serie => {
  let numbers: number[] = createRange(range[0], range[1] + 1);

  if (random) {
    numbers = shuffle(numbers);
  }

  return numbers.map((number) => ({
    number,
    text:
      version === Version.digital
        ? `${number}`
        : writtenNumber(number, { lang: "fr" }),
  }));
};

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
    fontFamily: '"Cursive Standard"',
  },
}));

const defaultConfig: Config = {
  range: [0, 20],
  sequencingMode: SequencingMode.literalThenDigital,
};

function App() {
  const [config = defaultConfig, setConfig] = useLocalStorage<Config>(
    "config",
    defaultConfig
  );

  const [started, setStarted] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [serie, setSerie] = useState<Serie>([]);
  const classes = useStyles();

  const start = (): void => {
    switch (config.sequencingMode) {
      case SequencingMode.literalOnly: {
        setSerie(createSerie(config.range, true, Version.literal));
        break;
      }
      case SequencingMode.literalThenDigital: {
        const serieDigital = createSerie(config.range, true, Version.literal);
        const serieLiteral = createSerie(config.range, true, Version.digital);
        setSerie(serieDigital.concat(serieLiteral));
        break;
      }
      case SequencingMode.digitalOnly: {
        setSerie(createSerie(config.range, true, Version.digital));
        break;
      }
      case SequencingMode.digitalThenLiteral: {
        const serieDigital = createSerie(config.range, true, Version.digital);
        const serieLiteral = createSerie(config.range, true, Version.literal);
        setSerie(serieDigital.concat(serieLiteral));
        break;
      }
      case SequencingMode.alternateDigitalAndLiteral:
      case SequencingMode.alternateLiteralAndDigital: {
        const serieDigital = createSerie(config.range, true, Version.digital);
        const serieLiteral = createSerie(config.range, true, Version.literal);

        setSerie(
          serieDigital.reduce((acc: Serie, curr, index) => {
            if (
              config.sequencingMode ===
              SequencingMode.alternateLiteralAndDigital
            ) {
              return acc.concat(serieLiteral[index], curr);
            } else {
              return acc.concat(curr, serieLiteral[index]);
            }
          }, [])
        );
        break;
      }
      case SequencingMode.alternateLiteralAndDigitalRandomly: {
        const serieDigital = createSerie(config.range, true, Version.digital);
        const serieLiteral = createSerie(config.range, true, Version.literal);

        setSerie(shuffle(serieDigital.concat(serieLiteral)));
        break;
      }
    }

    setCurrentIndex(0);
    setStarted(true);
  };

  useEffect(() => {
    if (!started) {
      return () => {};
    }

    const next = async () => {
      if (currentIndex >= 0) {
        await say(serie[currentIndex].number);
      }

      if (currentIndex < serie.length - 1) {
        setCurrentIndex(currentIndex + 1);
        return;
      }

      setStarted(false);
    };

    const handleKeydown = async (event: KeyboardEvent) => {
      if (event.code === "Space") {
        next();
      }
    };

    window.addEventListener("keydown", handleKeydown);

    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  }, [currentIndex, serie, started]);

  const renderNumber = () => {
    const { text }: SerieItem = serie[currentIndex];
    const fontSize = Math.min(8, 120 / text.length);

    return (
      <span
        className={classes.number}
        style={{
          fontSize: fontSize + "vw",
        }}
      >
        {text}
      </span>
    );
  };

  return (
    <div className={classes.root}>
      {started ? (
        renderNumber()
      ) : (
        <Settings
          config={config}
          onConfigChanged={(newConfig) => {
            setConfig({ ...config, ...newConfig });
          }}
          onSubmited={start}
        />
      )}

      <Toolbar range={config.range} hidden={!started} />
    </div>
  );
}

export default App;
