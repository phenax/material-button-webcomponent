
class MaterialBtn extends HTMLElement {

	constructor(props) {
		super(props);
		

	}

	connectedCallback() {
		console.log("Shitty shit");
	}

	disconnectedCallback() {

	}
}

customElements.define('material-btn', MaterialBtn);
