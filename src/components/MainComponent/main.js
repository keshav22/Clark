import { Button, Container, Col, Row } from "react-bootstrap";
import Questionaire from "../Questionnaire/questionnaire";

import "./main.css";

export default function Main() {
  return (
    <div className="main">
      <Questionaire></Questionaire>
    </div>
  );
}
