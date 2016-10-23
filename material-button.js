
class MaterialBtn extends HTMLElement {

	// static get observedAttributes() {
	// 	return [ "color" ];
	// }

	constructor() {
		super();

		this.DEFAULT_COLOR= '#3F51B5';

		this._buttonClickHandler= this._buttonClickHandler.bind(this);
		this._renderLoop= this._renderLoop.bind(this);

		const $content= document.currentScript.ownerDocument;
		const $template= $content.querySelector('#materialBtn');

		this._root= this.attachShadow({mode: 'open'});
		this._root.appendChild($template.content.cloneNode(true));
	}


	get text() { return this._text; }
	set text(_text) { this._text= _text; }

	get color() { return this._color; }
	set color(_color) { this._color= _color; }


	connectedCallback() {

		this._isAnimating= false;
		this._dimens= null;

		this._setUpComponent();

		this._$button= this._root.querySelector('.js-material-btn');
		this._$textEl= this._$button.querySelector('.js-text');
		this._$ripple= this._$button.querySelector('.js-ripple');

		this._initializeComponent();
	}

	_initializeComponent() {
		this._$textEl.textContent= this.text;

		this._$button.style.backgroundColor= this.color;

		this._$button.addEventListener('click', this._buttonClickHandler);
	}

	_buttonClickHandler(e) {
		this.triggerRipple({
			x: e.pageX,
			y: e.pageY
		});
	}

	triggerRipple(clickPos) {

		if(this._isAnimating)
			return;

		this._isAnimating= true;

		const dimens= this._$button.getBoundingClientRect();

		this._currentRipple= { scale: 0, opacity: 1 };
		this._targetRipple= {
			scale: Math.sqrt(
				Math.pow(dimens.width, 2) + 
				Math.pow(dimens.height, 2)
			),
			opacity: 0,
		};

		this._clickPos= {
			x: clickPos.x - dimens.left,
			y: clickPos.y - dimens.top
		};

		window.requestAnimationFrame(this._renderLoop);
	}

	_renderLoop() {

		this._$ripple.style.transform= `translate(${this._clickPos.x}px, ${this._clickPos.y}px) scale(${this._currentRipple.scale})`;
		this._$ripple.style.opacity= this._currentRipple.opacity;

		this._currentRipple.scale += (this._targetRipple.scale - this._currentRipple.scale)/10;
		this._currentRipple.opacity += (this._targetRipple.opacity - this._currentRipple.opacity)/10;

		if( this._currentRipple.opacity <= 0.01 )
			this._isAnimating= false;

		if(this._isAnimating)
			window.requestAnimationFrame(this._renderLoop);
		else
			this._$ripple.style.opacity= 0;
	}

	_setUpComponent() {

		this._color= this.dataset.color || this.DEFAULT_COLOR;
		
		this.text= this.textContent || '';
	}

	disconnectedCallback() {
		this._$button.removeEventListener('click', this._buttonClickHandler);
	}
}

customElements.define('material-btn', MaterialBtn);
