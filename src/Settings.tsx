import React from "react";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import { Config } from "./types";

interface Props {
  config: Config;
  onSubmited: () => void;
  onConfigChanged: (range: Config) => void;
}

const sequencingModeLabels = [
  "Uniquement la version litérale",
  "Uniquement la version numérique",
  "D’abord la version litérale puis numérique",
  "D’abord la version numérique puis litérale",
  "Alterner la version litérale et numérique",
  "Alterner la version numérique et digitale",
  "Alterner aléatoirement la version litérale et numérique",
];

const useStyles = makeStyles((theme) => ({
  root: {
    background: theme.palette.background.default,
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  section: {
    marginBottom: theme.spacing(4),
  },
  sectionTitle: {
    fontWeight: 600,
    fontSize: 16,
    marginBottom: theme.spacing(4),
  },
}));

function Parameters({ config, onSubmited, onConfigChanged }: Props) {
  const classes = useStyles();
  const { range } = config;

  return (
    <div className={classes.root}>
      <Container maxWidth="sm">
        <Grid container spacing={10}>
          <Grid item md={12}>
            <div className={classes.section}>
              <div className={classes.sectionTitle}>Plage de nombre</div>
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <TextField
                    variant="outlined"
                    size="small"
                    defaultValue={range[0]}
                    onChange={(event) => {
                      onConfigChanged({
                        ...config,
                        range: [parseInt(event.target.value, 10), range[1]],
                      });
                    }}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    variant="outlined"
                    size="small"
                    defaultValue={range[1]}
                    onChange={(event) => {
                      onConfigChanged({
                        ...config,
                        range: [range[0], parseInt(event.target.value, 10)],
                      });
                    }}
                    fullWidth
                  />
                </Grid>
              </Grid>
            </div>

            <div className={classes.section}>
              <div className={classes.sectionTitle}>Ordre d'apparition</div>
              <RadioGroup
                value={config.sequencingMode}
                onChange={(event) => {
                  onConfigChanged({
                    ...config,
                    sequencingMode: parseInt(event.target.value, 10),
                  });
                }}
              >
                {sequencingModeLabels.map((label, index) => (
                  <FormControlLabel
                    key={index}
                    value={index}
                    control={<Radio size="small" color="primary" />}
                    label={label}
                  />
                ))}
              </RadioGroup>
            </div>
          </Grid>
        </Grid>
        <Box marginTop={10} display="flex" justifyContent="center">
          <Button
            color="primary"
            size="large"
            variant="contained"
            onClick={onSubmited}
          >
            Commencer
          </Button>
        </Box>
      </Container>
    </div>
  );
}

export default Parameters;
