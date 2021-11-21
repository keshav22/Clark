import React from "react";
import Question from "./question";
import { mount, shallow } from "enzyme";

describe("rendering components", () => {
  it("renders Question component without crashing", () => {
    shallow(
      <Question
        question={{ headline: "dsdf" }}
        key={0}
        index={0}
        value={"dc"}
        markedForReview={true}
        answerThis={(question, key) => {}}
      />
    );
  });

  it("renders Question component with warning success", () => {
    const wrapper = mount(
      <Question
        question={{ headline: "dsdf" }}
        index={0}
        value={"dc"}
        markedForReview={true}
        answerThis={(question, key) => {}}
      />
    );
    expect(wrapper.find("#question").hasClass("question question-green question-yellow")).toEqual(true);
  });

  it("renders Question component with completly answeres success", () => {
    const wrapper = mount(
      <Question
        question={{ headline: "dsdf" }}
        index={0}
        value={"dc"}
        markedForReview={false}
        answerThis={(question, key) => {}}
      />
    );
    expect(wrapper.find("#question").hasClass("question question-green")).toEqual(true);
  });
  it("renders Question component with on hover click answer visible success", () => {
    const wrapper = mount(
      <Question
        question={{ headline: "dsdf" }}
        index={0}
        value={"dc"}
        markedForReview={false}
        answerThis={(question, key) => {}}
      />
    );

    wrapper.simulate('mouseenter');
    expect(wrapper.find("#question-click").text()).toEqual("Click to answer now ...");
  });
});
