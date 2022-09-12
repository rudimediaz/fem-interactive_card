import "./styles.scss";
import { InteractiveForm } from "./features/components/interactive-form";

customElements.define("interactive-form", InteractiveForm);
const confirmButton = document.getElementById("inp-submit");
const inputs = document.querySelectorAll(".cc-field");
const displays = document.querySelectorAll(".display-cc");
const interactiveForm = document.querySelector("interactive-form");
const continueButton = document.getElementById("inp-continue");
const form = document.querySelector("#form-cc");

document
  .querySelector("#form-cc")
  .addEventListener("submit", function (ev) {
    ev.preventDefault();
  });

displays.forEach((el) => {
  el.addEventListener("userinput", function (ev) {
    if (!ev.detail.value) {
      this.textContent = this.dataset.defaultValue || "";
    } else {
      this.textContent = ev.detail.value;
    }
  });
});

inputs.forEach((inputField) => {
  inputField.addEventListener("input", function (ev) {
    if (this.validity.valid) {
      resetMessage.call(this);
    }

    this.dispatchEvent(
      new CustomEvent("userinput", { bubbles: false })
    );

    queueMicrotask(() => {
      this.checkValidity();
    });
  });

  inputField.addEventListener("userinput", function (ev) {
    const displayTarget = document.getElementById(
      this.dataset.displayFor
    );

    displayTarget.dispatchEvent(
      new CustomEvent("userinput", {
        detail: { value: ev.target.value },
      })
    );
  });

  inputField.addEventListener("blur", function (ev) {
    if (this.validity.valid) {
      resetMessage.call(this);
    }
    if (!ev.target.value) {
      this.setAttribute("required", "");
    } else {
      this.removeAttribute("required");
    }
    this.checkValidity();
  });

  inputField.addEventListener("invalid", function (ev) {
    const target = document.getElementById(this.dataset.messageFor);

    if (this.validity.valueMissing) {
      target.textContent = form.dataset.messageBlank;
    } else if (this.validity.patternMismatch) {
      target.textContent = this.dataset.messagePattern || "";
    } else if (this.validity.tooShort) {
      target.textContent = "Too short";
    }
  });
});

confirmButton.addEventListener("click:aftercheck", function (ev) {
  if (ev.detail.inputValidities.every((valid) => valid)) {
    interactiveForm.setComplete();
  }
});

confirmButton.addEventListener("click", function (ev) {
  ev.preventDefault();
  inputs.forEach((input) => input.dispatchEvent(new Event("blur")));
  queueMicrotask(() => {
    this.dispatchEvent(
      new CustomEvent("click:aftercheck", {
        detail: {
          inputValidities: Array.from(inputs).map(
            (input) => input.validity.valid
          ),
        },
      })
    );
  });
});

continueButton.addEventListener("click", function () {
  interactiveForm.setActive();
  queueMicrotask(() => {
    inputs.forEach((input) => {
      input.value = "";
      input.dispatchEvent(
        new CustomEvent("userinput", { bubbles: false })
      );
    });
  });
});

function resetMessage() {
  document.querySelector("#" + this.dataset.messageFor).textContent =
    "";
}
