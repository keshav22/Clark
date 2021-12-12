import { Button, Container, Col, Row, Carousel } from "react-bootstrap";
import Question from "../Question/question";
import "./questionnairePanel.css";
import * as QuestionaireJson from "../../assests/questionnaire.json";
import { useState } from "react";
import { SwitchTransition, CSSTransition } from "react-transition-group";

export default function QuestionairePanel(props) {
  return (
    <Row className="questionnaire-header-row extra-margin">
      <Col>
        <div className="questionnaire-header">
          <div>
            <h5>{props.name}</h5>
          </div>
          <div>
            <Button
              variant="outline-secondary"
              onClick={() => {
                props.onStart();
              }}
            >
              Start
            </Button>
            <span style={{ margin: 10 }}></span>
            <Button
              variant="outline-success"
              onClick={() => {
                props.onSubmit();
              }}
            >
              Submit
            </Button>
          </div>
        </div>
      </Col>
    </Row>
  );
}
