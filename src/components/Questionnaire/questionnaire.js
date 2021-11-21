import {
  Button,
  Container,
  Col,
  Row,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import Question from "../Question/question";
import "./questionnaire.css";
import * as QuestionaireJson from "../../assests/questionnaire.json";
import { useState } from "react";
import { SwitchTransition, CSSTransition } from "react-transition-group";
import QuestionairePanel from "../QuestionnairePanel/questionnairePanel";

export default function Questionaire() {
  const [questionnaireData, setQuestionnaireData] = useState(
    QuestionaireJson.questionnaire
  );
  const [questionnaireAnswerMode, setQuestionnaireAnswerMode] = useState(false);
  const [questionCurrent, setQuestionCurrent] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [questionAnswerStore, setQuestionAnswerStore] = useState({});
  const [questionReviewStore, setQuestionReviewStore] = useState({});
  const [state, setState] = useState(true);
  const [side, setSide] = useState("right");
  const [mode, setMode] = useState("out-in");

  const [toastShow, setToastShow] = useState(false);
  const [toastHeading, setToastHeading] = useState("");
  const [toastBody, setToastBody] = useState("");
  const [toastVariant, setToastVariant] = useState("");

  const startQuestinnaire = () => {
    setCurrentIndex(0);
    setQuestionCurrent(questionnaireData.questions[0]);
    setQuestionnaireAnswerMode(true);
  };

  const showToast = (header, body, variant) => {
    setToastHeading(header);
    setToastBody(body);
    setToastVariant(variant);
    setToastShow(true);
  };

  const getUnFilledQuestion = () => {
    let questions = questionnaireData.questions;
    for (let i = 0; i < questions.length; i++) {
      let value = questionAnswerStore[questions[i].identifier];
      if (!(value && value.length > 0)) {
        return questions[i];
      }
    }
    return null;
  };

  const submitQuestionnaire = () => {
    let unFill = getUnFilledQuestion();
    if (unFill) {
      showToast("Error", "Some questions are yet to be filled.", "danger");
    } else if (Object.keys(questionReviewStore).length > 0) {
      showToast("Warning", "Some questions are marked for review.", "warning");
    } else {
      showToast("Success", "Questionnaire submitted successfully.", "success");
    }
  };

  const handleResponse = (index, value) => {
    if (questionCurrent.question_type == "text") {
      questionAnswerStore[questionCurrent.identifier] = value;
    } else {
      if (questionCurrent.multiple == "true") {
        let values = questionAnswerStore[questionCurrent.identifier];
        if (values) {
          if (values.includes(index)) {
            let getIndex = values.findIndex((x) => x == index);
            values.splice(getIndex, 1);
          } else {
            values = [index].concat(values);
          }
        } else values = [index];
        questionAnswerStore[questionCurrent.identifier] = values;
      } else {
        let values = questionAnswerStore[questionCurrent.identifier];
        if (values && values.includes(index)) {
          let getIndex = values.findIndex((x) => x == index);
          values.splice(getIndex, 1);
        } else {
          values = [index];
        }
        questionAnswerStore[questionCurrent.identifier] = values;
      }
    }
    setQuestionAnswerStore(JSON.parse(JSON.stringify(questionAnswerStore)));
  };

  const getValue = (index) => {
    if (questionCurrent.question_type == "text") {
      return questionAnswerStore[questionCurrent.identifier]
        ? questionAnswerStore[questionCurrent.identifier]
        : "";
    } else {
      if (
        questionAnswerStore[questionCurrent.identifier] &&
        questionAnswerStore[questionCurrent.identifier].includes(index)
      )
        return true;
      else return false;
    }
  };

  return (
    <div className="questionnaire">
      {questionnaireAnswerMode ? (
        <div className="questionnaire-answer-mode horizonatal-center align-center">
          <div className="question-header-button">
            <Button
              variant="outline-info"
              onClick={() => {
                setQuestionnaireAnswerMode(false);
              }}
            >
              Go back
            </Button>
            <Button
              variant={`${
                questionReviewStore[questionCurrent.identifier]
                  ? "warning"
                  : "outline-warning"
              }`}
              onClick={() => {
                if (questionReviewStore[questionCurrent.identifier]) {
                  delete questionReviewStore[questionCurrent.identifier];
                } else questionReviewStore[questionCurrent.identifier] = true;
                setQuestionReviewStore(
                  JSON.parse(JSON.stringify(questionReviewStore))
                );
              }}
            >
              {`${
                questionReviewStore[questionCurrent.identifier]
                  ? "Un-Mark"
                  : "Mark for Review"
              }`}
            </Button>
          </div>

          <SwitchTransition mode={mode}>
            <CSSTransition
              key={state}
              addEndListener={(node, done) => {
                node.addEventListener("transitionend", done, false);
              }}
              classNames={side == "left" ? "fade-left" : "fade"}
            >
              <div className="question-body">
                <div>
                  <Row>
                    <Col>
                      <h2>
                        Q{currentIndex + 1}. {questionCurrent.headline}
                      </h2>
                    </Col>
                  </Row>
                  <div className="answer-input">
                    {questionCurrent.question_type == "text" ? (
                      <input
                        className="input-answer"
                        placeholder="Type your answer here..."
                        onChange={(e) => {
                          handleResponse(0, e.target.value);
                        }}
                        value={getValue(0)}
                      ></input>
                    ) : (
                      questionCurrent.choices.map((choice, index) => {
                        return (
                          <Row key={index}>
                            <Col>
                              <div className="form-check">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  checked={getValue(index)}
                                  onChange={() => {}}
                                  onClick={() => {
                                    handleResponse(index, "");
                                  }}
                                  id={`flexCheckDefault${index}`}
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor={`flexCheckDefault${index}`}
                                >
                                  {choice.label}
                                </label>
                              </div>
                            </Col>
                          </Row>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            </CSSTransition>
          </SwitchTransition>
          <div className="question-footer-button">
            <Button
              variant="outline-info"
              onClick={() => {
                let newIndex = currentIndex - 1;
                if (newIndex < 0) {
                  newIndex = questionnaireData.questions.length - 1;
                }
                setSide("left");
                setTimeout(() => {
                  setState(!state);
                  setQuestionCurrent(questionnaireData.questions[newIndex]);
                  setCurrentIndex(newIndex);
                }, 0);
              }}
            >{`<`}</Button>
            <Button
              variant="outline-info"
              onClick={() => {
                let newIndex = currentIndex + 1;
                if (newIndex >= questionnaireData.questions.length) {
                  newIndex = 0;
                }
                setSide("right");
                setTimeout(() => {
                  setState(!state);
                  setQuestionCurrent(questionnaireData.questions[newIndex]);
                  setCurrentIndex(newIndex);
                }, 0);
              }}
            >
              {`>`}
            </Button>
          </div>
        </div>
      ) : (
        <Container>
          <QuestionairePanel
            name={questionnaireData.name}
            onSubmit={submitQuestionnaire}
            onStart={startQuestinnaire}
          />
          <Row className="questionnaire-description-row">
            <Col>
              <div className="questionnaire-description">
                <h5>Description</h5>
                {questionnaireData.description}
              </div>
            </Col>
          </Row>
          <h5>Answer the below questions</h5>
          {questionnaireData.questions &&
          questionnaireData.questions.length > 0 ? (
            <div>
              {questionnaireData.questions.map((ques, index) => {
                return (
                  <Question
                    question={ques}
                    key={index}
                    index={index}
                    value={questionAnswerStore[ques.identifier]}
                    markedForReview={questionReviewStore[ques.identifier]}
                    answerThis={(question, key) => {
                      setCurrentIndex(key);
                      setQuestionCurrent(question);
                      setQuestionnaireAnswerMode(true);
                    }}
                  ></Question>
                );
              })}
            </div>
          ) : null}
          <QuestionairePanel
            name={questionnaireData.name}
            onSubmit={submitQuestionnaire}
            onStart={startQuestinnaire}
          />
        </Container>
      )}
      <ToastContainer className="p-3" position="top-center">
        <Toast
          onClose={() => setToastShow(false)}
          bg={toastVariant}
          show={toastShow}
          delay={3000}
          autohide
        >
          <Toast.Header>
            <img
              src="holder.js/20x20?text=%20"
              className="rounded me-2"
              alt=""
            />
            <strong className="me-auto">{toastHeading}</strong>
          </Toast.Header>
          <Toast.Body>{toastBody}</Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
}
