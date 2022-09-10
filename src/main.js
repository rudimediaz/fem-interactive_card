import "./styles.scss";
import { InteractiveForm } from "./features/components/interactive-form";

/**
 *
 * @typedef {Object} FieldElement
 * @property { HTMLInputElement } fieldEl
 * @property { HTMLElement } messageEl
 * @property { string } patternErrorMessage
 */

const ccNumberInputEl = document.getElementById("inp-cc-number");
const ccNumberMessageEl = document.getElementById(
  ccNumberInputEl.dataset.messageFor
);
/**@type {FieldElement} */
const ccFieldElement = {
  fieldEl: ccNumberInputEl,
  messageEl: ccNumberMessageEl,
  patternErrorMessage: "Wrong format, number only",
};

customElements.define("interactive-form", InteractiveForm);

ccNumberInputEl.addEventListener(
  "input:valid",
  handleValid.bind(ccFieldElement)
);
ccNumberInputEl.addEventListener(
  "input:invalid",
  handleInvalid.bind(ccFieldElement)
);
ccNumberInputEl.addEventListener(
  "input",
  handleInput.bind(ccFieldElement)
);

ccNumberInputEl.addEventListener(
  "blur",
  handleFocusOut.bind(ccFieldElement)
);

/**
 * @this FieldElement
 * @param { InputEvent } ev
 */
function handleInput(ev) {
  if (this.fieldEl.validity.patternMismatch) {
    ev.target.dispatchEvent(new CustomEvent("input:invalid"));
  } else {
    ev.target.dispatchEvent(new CustomEvent("input:valid"));
  }
}

/**
 * @this FieldElement
 * @param { InputEvent } ev
 */
function handleInvalid(ev) {
  setTextContent.call(this.messageEl, this.patternErrorMessage);
  classListChange.call(this.messageEl, addInvalidClassAction());
}

/**
 * @this FieldElement
 * @param {Event} ev
 */
function handleFocusOut(ev) {
  if (!ev.target.value) {
    setTextContent.call(this.messageEl, `Can't be blank`);
    classListChange.call(this.messageEl, addInvalidClassAction());
  } else {
    const isValid = this.fieldEl.checkValidity();

    if (isValid) {
      classListChange.call(
        this.messageEl,
        removeInvalidClassAction()
      );
    } else {
      ev.target.dispatchEvent(new CustomEvent("input:invalid"));
    }
  }
}

/**
 * @this HTMLInputElement
 * @param { InputEvent } ev
 */
function handleValid(ev) {
  classListChange.call(this.messageEl, removeInvalidClassAction());
}

/**
 * @typedef { Object } ClassListAction
 * @property { 'add' | 'remove' } type
 * @property { name } className
 */

/**
 *
 * @this HTMLElement
 * @param {ClassListAction} action
 */
function classListChange(action) {
  switch (action.type) {
    case "add":
      this.classList.add(action.className);
      break;
    case "remove":
      this.classList.remove(action.className);
      break;
    default:
      this.classList.toggle(action.className);
  }
}

/**
 * @this HTMLElement
 * @param {string} value
 */
function setTextContent(value) {
  this.textContent = value;
}

function removeInvalidClassAction() {
  return { type: "remove", className: "field-message_invalid" };
}

function addInvalidClassAction() {
  return { type: "add", className: "field-message_invalid" };
}
