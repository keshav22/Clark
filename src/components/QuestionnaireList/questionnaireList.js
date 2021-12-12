import {
  Button,
  Container,
  Col,
  Row
} from "react-bootstrap";
import Question from "../Question/question";
import "./questionnaireList.css";
import QuestionairePanel from "../QuestionnaireHeaderPanel/questionnairePanel";

export default function QuestionaireList(props) {
  
  return (
    <Container>
      <QuestionairePanel
        name={props.questionnaireData.name}
        onSubmit={props.submitQuestionnaire}
        onStart={props.startQuestinnaire}
      />
      <Row className="questionnaire-description-row">
        <Col>
          <div className="questionnaire-description">
            <h5>Description</h5>
            {props.questionnaireData.description}
          </div>
        </Col>
      </Row>
      <h5>Answer the below questions</h5>
      {props.questionnaireData.questions && props.questionnaireData.questions.length > 0 ? (
        <div>
          {props.questionnaireData.questions.map((ques, index) => {
            return (
              <Question
                question={ques}
                key={index}
                index={index}
                value={props.questionAnswerStore[ques.identifier]}
                markedForReview={props.questionReviewStore[ques.identifier]}
                answerThis={(question, key) => {
                  props.setCurrentIndex(key);
                  props.setQuestionCurrent(question);
                  props.setQuestionnaireAnswerMode(true);
                }}
              ></Question>
            );
          })}
        </div>
      ) : null}
      <QuestionairePanel
        name={props.questionnaireData.name}
        onSubmit={props.submitQuestionnaire}
        onStart={props.startQuestinnaire}
      />
    </Container>
  );
}
