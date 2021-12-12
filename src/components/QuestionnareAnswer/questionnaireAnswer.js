import { Button, Container, Col, Row } from "react-bootstrap";
import "./questionnaireAnswer.css";
import { useState } from "react";
import { SwitchTransition, CSSTransition } from "react-transition-group";

export default function QuestionaireAnswer(props) {
  const [state, setState] = useState(true);
  const [side, setSide] = useState("right");
  const [mode, setMode] = useState("out-in");

  const nextPrevEligibility = () => {
    let answers = props.questionAnswerStore[props.questionCurrent.identifier];
    if (answers && answers.length > 0) {
      return true;
    }
    props.showToast("Error", "Questions can't be left blank.", "danger");
    return false;
  };

  const handleResponse = (index, value) => {
    let questionCurrent = props.questionCurrent;
    let questionAnswerStore = props.questionAnswerStore;
    let questionnaireData = props.questionnaireData;
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
    if (
      questionCurrent.jumps &&
      questionCurrent.jumps.length > 0 &&
      questionCurrent.question_type == "multiple-choice"
    ) {
      let jumps = questionCurrent.jumps;
      for (let i = 0; i < jumps.length; i++) {
        let questionId = jumps[i].conditions[0].field;
        let targetValue = jumps[i].conditions[0].value;
        let conditionValue = questionAnswerStore[questionId];
        let labelValue = questionCurrent.choices[conditionValue[0]].label;
        if (labelValue == targetValue) {
          let jumpIndex = questionnaireData.questions.findIndex(
            (x) => x.identifier == jumps[i].destination.id
          );
          if (jumpIndex < props.currentIndex) {
            setSide("left");
          } else {
            setSide("right");
          }
          setTimeout(() => {
            setState(!state);
            props.setQuestionCurrent(questionnaireData.questions[jumpIndex]);
            props.setCurrentIndex(jumpIndex);
          }, 0);
          break;
        }
      }
    }
    props.setQuestionAnswerStore(
      JSON.parse(JSON.stringify(questionAnswerStore))
    );
  };

  return (
    <div className="questionnaire-answer-mode horizonatal-center align-center">
      <div className="question-header-button">
        <Button
          variant="outline-info"
          onClick={() => {
            props.setQuestionnaireAnswerMode(false);
          }}
        >
          Go back
        </Button>
        <Button
          variant={`${
            props.questionReviewStore[props.questionCurrent.identifier]
              ? "warning"
              : "outline-warning"
          }`}
          onClick={() => {
            if (props.questionReviewStore[props.questionCurrent.identifier]) {
              delete props.questionReviewStore[
                props.questionCurrent.identifier
              ];
            } else
              props.questionReviewStore[
                props.questionCurrent.identifier
              ] = true;
            props.setQuestionReviewStore(
              JSON.parse(JSON.stringify(props.questionReviewStore))
            );
          }}
        >
          {`${
            props.questionReviewStore[props.questionCurrent.identifier]
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
                    Q{props.currentIndex + 1}. {props.questionCurrent.headline}
                  </h2>
                </Col>
              </Row>
              <div className="answer-input">
                {props.questionCurrent.question_type == "text" ? (
                  <input
                    className="input-answer"
                    placeholder="Type your answer here..."
                    onChange={(e) => {
                      handleResponse(0, e.target.value);
                    }}
                    value={props.getValue(0)}
                  ></input>
                ) : (
                  props.questionCurrent.choices.map((choice, index) => {
                    return (
                      <Row key={index}>
                        <Col>
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              checked={props.getValue(index)}
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
            if (nextPrevEligibility()) {
              let newIndex = props.currentIndex - 1;
              if (newIndex < 0) {
                newIndex = props.questionnaireData.questions.length - 1;
              }
              setSide("left");
              setTimeout(() => {
                setState(!state);
                props.setQuestionCurrent(
                  props.questionnaireData.questions[newIndex]
                );
                props.setCurrentIndex(newIndex);
              }, 0);
            }
          }}
        >{`<`}</Button>
        <Button
          variant="outline-info"
          onClick={() => {
            if (nextPrevEligibility()) {
              let newIndex = props.currentIndex + 1;
              if (newIndex >= props.questionnaireData.questions.length) {
                newIndex = 0;
              }
              setSide("right");
              setTimeout(() => {
                setState(!state);
                props.setQuestionCurrent(
                  props.questionnaireData.questions[newIndex]
                );
                props.setCurrentIndex(newIndex);
              }, 0);
            }
          }}
        >
          {`>`}
        </Button>
      </div>
    </div>
  );
}
