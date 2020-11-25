import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import cn from "classnames";
import { Range } from "./types";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "fixed",
    width: "100%",
    left: 0,
    bottom: theme.spacing(5),
    display: "flex",
    justifyContent: "center",
    transition: theme.transitions.create("transform"),
  },
  hidden: {
    transform: "translateY(72px)",
  },
  disabled: {
    opacity: 0.5,
  },
  range: {
    fontSize: 16,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    color: "white",
    border: "solid 2px",
    borderRadius: 4,
    lineHeight: "24px",
    fontWeight: 600,
    padding: theme.spacing(0, 1),
    display: "inline-block",
    textAlign: "center",
  },
}));

interface Props {
  range: Range;
  hidden: boolean;
}

function Parameters({ range, hidden }: Props) {
  const classes = useStyles();

  return (
    <div className={cn(classes.root, { [classes.hidden]: hidden })}>
      <div className={cn(classes.range, classes.disabled)}>
        {range[0]} &#8594; {range[1]}
      </div>
    </div>
  );
}

export default Parameters;
