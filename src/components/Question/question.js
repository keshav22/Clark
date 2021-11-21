import { useEffect, useState } from "react";
import { Button, Container, Col, Row } from "react-bootstrap";
import "./question.css";

export default function Question(props) {
  const [question, setQuestion] = useState(props.question);
  const [displayAnswerNow, setDisplayAnswerNow] = useState(false);
  const [questionAswered, setQuestionAswered] = useState(false);

  useEffect(() => {
    if (props.value && props.value.length > 0) {
      setQuestionAswered(true);
    } else {
      setQuestionAswered(false);
    }
  }, [props.value]);

  const getQuestionClass = () => {
    return `question ${questionAswered ? "question-green" : ""} ${
      props.markedForReview ? "question-yellow" : ""
    }`;
  };

  return (
    <div
      id="question"
      onClick={() => {
        props.answerThis(question, props.index);
      }}
      className={getQuestionClass()}
      onMouseEnter={() => {
        setDisplayAnswerNow(true);
      }}
      onMouseLeave={() => {
        setDisplayAnswerNow(false);
      }}
    >
      <div>Q{props.index+1}. {question.headline}</div>
      {displayAnswerNow ? (
        <div id="question-click" className="question-hover">
          Click to answer now ...
        </div>
      ) : null}
    </div>
  );
}
