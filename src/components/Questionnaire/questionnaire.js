import { Toast, ToastContainer } from "react-bootstrap";
import "./questionnaire.css";
import * as QuestionaireJson from "../../assests/questionnaire.json";
import { useState, useCallback } from "react";
import QuestionnaireAnswer from "../QuestionnareAnswer/questionnaireAnswer";
import QuestionaireList from "../QuestionnaireList/questionnaireList";

export default function Questionaire() {
  
  //Questionnaire data is assigned to state hence the data is not fetched again. #reusability
  const [questionnaireData, setQuestionnaireData] = useState(
    QuestionaireJson.questionnaire
  ); 

  const [questionnaireAnswerMode, setQuestionnaireAnswerMode] = useState(false);
  const [questionCurrent, setQuestionCurrent] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [questionAnswerStore, setQuestionAnswerStore] = useState({});
  const [questionReviewStore, setQuestionReviewStore] = useState({});

  //All toast states could be kept in a different component.
  const [toastShow, setToastShow] = useState(false);
  const [toastHeading, setToastHeading] = useState("");
  const [toastBody, setToastBody] = useState("");
  const [toastVariant, setToastVariant] = useState("");

  const startQuestinnaire = useCallback(() => {
    setCurrentIndex(0);
    setQuestionCurrent(questionnaireData.questions[0]);
    setQuestionnaireAnswerMode(true);
  }, []);

  const showToast = useCallback(
    (header, body, variant) => {
      setToastHeading(header);
      setToastBody(body);
      setToastVariant(variant);
      setToastShow(true);
    },
    [toastHeading, toastBody, toastVariant, toastShow]
  );

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

  const submitQuestionnaire = useCallback(() => {
    let unFill = getUnFilledQuestion();
    if (unFill) {
      showToast("Error", "Some questions are yet to be filled.", "danger");
    } else if (Object.keys(questionReviewStore).length > 0) {
      showToast("Warning", "Some questions are marked for review.", "warning");
    } else {
      showToast("Success", "Questionnaire submitted successfully.", "success");
    }
  }, [questionAnswerStore]);

  const getValue = useCallback(
    (index) => {
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
    },
    [questionCurrent, questionAnswerStore]
  );

  const handleQuestionnaireCurrent = useCallback(
    (q) => setQuestionCurrent(q),
    [questionCurrent]
  );
  const handleCurrentIndex = useCallback(
    (i) => setCurrentIndex(i),
    [currentIndex]
  );
  const handleMode = useCallback(
    (m) => setQuestionnaireAnswerMode(m),
    [questionnaireAnswerMode]
  );
  const handleReviewStore = useCallback(
    (ans) => setQuestionReviewStore(ans),
    [questionReviewStore]
  );
  const handleAnswerStore = useCallback(
    (ans) => setQuestionAnswerStore(ans),
    [questionAnswerStore]
  );

  return (
    <div className="questionnaire">
      {questionnaireAnswerMode ? (
        <QuestionnaireAnswer
          questionnaireData={questionnaireData}
          currentIndex={currentIndex}
          questionCurrent={questionCurrent}
          questionReviewStore={questionReviewStore}
          questionAnswerStore={questionAnswerStore}
          getValue={getValue}
          setQuestionCurrent={handleQuestionnaireCurrent}
          setCurrentIndex={handleCurrentIndex}
          setQuestionnaireAnswerMode={handleMode}
          setQuestionReviewStore={handleReviewStore}
          setQuestionAnswerStore={handleAnswerStore}
          showToast={showToast}
        />
      ) : (
        <QuestionaireList
          questionnaireData={questionnaireData}
          questionAnswerStore={questionAnswerStore}
          questionReviewStore={questionReviewStore}
          setQuestionCurrent={handleQuestionnaireCurrent}
          setCurrentIndex={handleCurrentIndex}
          setQuestionnaireAnswerMode={handleMode}
          submitQuestionnaire={submitQuestionnaire}
          startQuestinnaire={startQuestinnaire}
        />
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
