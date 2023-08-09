import React, { Dispatch, SetStateAction } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import styles from "./styles.module.css";
import Skeleton from "@mui/material/Skeleton";

type AnswerProps = {
  question: string;
  answer: string;

  showAnswer: boolean;
  setShowAnswer: Dispatch<SetStateAction<boolean>>;
};

export default function AnswerCard({ showAnswer, setShowAnswer, question, answer }: AnswerProps) {
  const mountedStyle = { animation: "inAnimation 250ms ease-in" };
  const unmountedStyle = {
    animation: "outAnimation 500ms ease-out",
    animationFillMode: "forwards",
  };

  return (
    <Card
      style={showAnswer ? mountedStyle : unmountedStyle}
      sx={{ minWidth: 280, maxWidth: 640 }}
      className={styles.cardWrapper}
    >
      <CardContent>
        <Typography sx={{ fontSize: "0.8rem", color: "var(--ifm-menu-color)" }} gutterBottom>
          {question}
        </Typography>
        {answer.length > 0 ? (
          <Typography>{answer}</Typography>
        ) : (
          <Skeleton variant="text" width={300} height={32} sx={{ fontSize: "1rem" }} />
        )}
      </CardContent>
      <CardActions>
        <Button size="small">Learn More</Button>
      </CardActions>
    </Card>
  );
}
