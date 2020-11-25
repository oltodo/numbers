import React from "react";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import { Range } from "./types";

const useStyles = makeStyles((theme) => ({
  root: {},
  form: {
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
  formInner: {},
  formSection: {
    marginBottom: theme.spacing(4),
  },
  formSectionTitle: {
    fontWeight: 500,
    fontSize: 16,
    marginBottom: theme.spacing(4),
  },
}));

interface Props {
  range: Range;
  onSubmited: () => void;
  onRangeChanged: (range: Range) => void;
}

function Parameters({ range, onSubmited, onRangeChanged }: Props) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.form}>
        <Container className={classes.formInner} maxWidth="sm">
          <Grid container spacing={10}>
            <Grid item md={12}>
              <div className={classes.formSection}>
                <div className={classes.formSectionTitle}>Plage de nombre</div>
                <Grid container spacing={3}>
                  <Grid item xs={6}>
                    <TextField
                      variant="outlined"
                      size="small"
                      defaultValue={range[0]}
                      onChange={(event) => {
                        onRangeChanged([
                          parseInt(event.target.value, 10),
                          range[1],
                        ]);
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
                        onRangeChanged([
                          range[0],
                          parseInt(event.target.value, 10),
                        ]);
                      }}
                      fullWidth
                    />
                  </Grid>
                </Grid>
              </div>
              {/* <div className={classes.formSection}>
                <div className={classes.formSectionTitle}>
                  Durée de la session
                </div>
              </div> */}
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
    </div>
  );
}

export default Parameters;
