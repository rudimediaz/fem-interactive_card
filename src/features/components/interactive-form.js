const STATUS = "status";
const ACTIVE = "active";
const COMPLETED = "completed";
const VIEW = "view";

const ELEMENT_PART = new WeakMap();

export class InteractiveForm extends HTMLElement {
  elementParts = new Set();

  constructor() {
    super();
    ELEMENT_PART.set(this, this.elementParts);
    this.attachShadow({ mode: "open" });
    this.style.setProperty("display", "contents");
    const slot = document.createElement("slot");
    slot.name = "view";
    this.shadowRoot.appendChild(slot);
  }

  static get observedAttributes() {
    return [STATUS];
  }

  get status() {
    return this.getAttribute("status");
  }

  setActive() {
    this.setAttribute("status", ACTIVE);
  }

  setComplete() {
    this.setAttribute("status", COMPLETED);
  }

  connectedCallback() {
    //

    if (!this.status) {
      this.setActive();
    }
    setSlotting.call(this);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === STATUS && oldValue !== newValue) {
      setSlotting.call(this);
    }
  }
}

/**
 * @this InteractiveForm
 */
function setSlotting() {
  const parts = getParts.call(this);

  for (const part of parts) {
    if (part.dataset.viewId === this.status) {
      part.slot = VIEW;
    } else {
      part.slot = "";
    }
  }
}

/**
 * @this InteractiveForm
 */
function getParts() {
  const parts = ELEMENT_PART.get(this);

  if (parts && parts.size !== 0) {
    return Array.from(parts);
  } else {
    let views = this.querySelectorAll(`[data-view-id]`);

    for (const view of views) {
      this.elementParts.add(view);
    }

    ELEMENT_PART.set(this, this.elementParts);

    return Array.from(views);
  }
}
