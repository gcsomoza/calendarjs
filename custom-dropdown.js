// Creates CustomDropdown extending HTML Element
class CustomDropdown extends HTMLElement {
    // Fires when an instance of the element is created or updated
    constructor() {
        super();

        if (typeof window.getCustomDropdown !== 'function') {
            window.getCustomDropdown = function(el) {
                return el.closest('custom-dropdown');
            }
        }
    }

    // Fires when an instance was inserted into the document
    connectedCallback() {
        this.setAttribute('tabindex', '0');
        this.drawDropdown();
    }

    // Fires when an instance was removed from the document
    disconnectedCallback() {
    }

    // Fires when an attribute was added, removed, or updated
    attributeChangedCallback(attrName, oldVal, newVal) {
    }

    // Fires when an element is moved to a new document
    adoptedCallback() {
    }

    _emptyValue = { value: '--', text: '--' };
    _options = [ this._emptyValue ];
    _selectedIndex = 0;

    set selectedIndex(value) {
        this._selectedIndex = value;
        this.changeDisplayedSelectedOptionText();
        this.dispatchEventChange();
    }

    get selectedIndex() {
        if (isNaN(this._selectedIndex)) return 0;
        if (this._selectedIndex < 0) return 0;
        if (this._selectedIndex >= this.options.length) return this.options.length - 1;
        return parseInt(this._selectedIndex);
    }

    get value() {
        return this.options[this.selectedIndex];
    }

    set options(options) {
        this._options = [this._emptyValue, ...options];
        this.changeDisplayedOptions()
    }

    get options() {
        return this._options;
    }

    changeDisplayedOptions() {
        const options = this.getOptionsHTML();
        this.querySelector('[options]').innerHTML = options;
    }

    changeDisplayedSelectedOptionText() {
        const text = this.options[this.selectedIndex].text;
        this.querySelector('[selected-option]').textContent = text;
    }

    dispatchEventChange() {
        var event = new Event('change');
        this.dispatchEvent(event);
    }

    optionClicked(event) {
        this.selectedIndex = event.target.getAttribute('index');
    }

    getOptionsHTML() {
        let options = '';
        for (let i = 0; i < this.options.length; i++) {
            const option = this.options[i];
            options += `<div index="${i}" value="${option.value}" onclick="getCustomDropdown(this).optionClicked(event)">${option.text}</div>`;
        }
        return options;
    }

    drawDropdown() {
        const options = this.getOptionsHTML();
        this.innerHTML = `
        <div selected-option>${this.options[this.selectedIndex].text}</div>
        <div options>
            ${options}
        </div>
        `;
    }
}

// Registers custom element
window.customElements.define('custom-dropdown', CustomDropdown);