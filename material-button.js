
class MaterialBtn extends HTMLElement {

	// static get observedAttributes() {
	// 	return [ "color" ];
	// }

	constructor() {
		super();

		this.DEFAULT_COLOR= '#3F51B5';


		this._buttonClickHandler= this._buttonClickHandler.bind(this);
		this._calculationLoop= this._calculationLoop.bind(this);
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

	_setUpComponent() {

		this._color= this.dataset.color || this.DEFAULT_COLOR;

		this.text= this.textContent || '';
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


	/**
	 * (public) Trigger a ripple in the button
	 * 
	 * @param  {[type]} clickPos [description]
	 */
	triggerRipple(clickPos) {

		if(this._isAnimating)
			return;

		this._isAnimating= true;

		this._setupAnimationInitialState(clickPos);

		window.requestAnimationFrame(this._calculationLoop);
		window.requestAnimationFrame(this._renderLoop);
	}

	_setupAnimationInitialState(clickPos) {

		// Dimensions and position data
		const dimens= this._$button.getBoundingClientRect();


		// current state of the ripple
		this._currentRipple= { scale: 0, opacity: 1 };


		// relative click position
		this._clickPos= {
			x: (clickPos)? clickPos.x - dimens.left: dimens.width/2,
			y: (clickPos)? clickPos.y - dimens.top: dimens.height/2
		};


		// Dont know what to call this. It does some calculation.
		const getRippleSize= (size, pos) => ((pos > size/2)? pos: size - pos);


		// The target state of the ripple
		this._targetRipple= {
			scale: 2* Math.sqrt(
				Math.pow(getRippleSize(dimens.width, this._clickPos.x),  2) + 
				Math.pow(getRippleSize(dimens.height, this._clickPos.y), 2)
			),
			opacity: 0,
		};
	}

	_calculationLoop() {

		// current+= (target - current)/strength for easing the increments
		this._currentRipple.scale +=   (this._targetRipple.scale - this._currentRipple.scale)/10;

		this._currentRipple.opacity += (this._targetRipple.opacity - this._currentRipple.opacity)/15;


		// If the opacity crosses a minimum, stop loop
		if( this._currentRipple.opacity <= 0.05 )
			this._isAnimating= false;
		else
			window.requestAnimationFrame(this._calculationLoop);
	}

	_renderLoop() {


		// apply the styles in the calculation loop
		this._$ripple.style.transform= `
			translate(${this._clickPos.x}px, ${this._clickPos.y}px)
			scale(${this._currentRipple.scale})
		`;

		this._$ripple.style.opacity= this._currentRipple.opacity;


		// If the calculation loop has ended, stop animating and reset the styles
		if(this._isAnimating)
			window.requestAnimationFrame(this._renderLoop);
		else {
			this._$ripple.style.transform= 'none'
			this._$ripple.style.opacity= 0;
		}
	}

	disconnectedCallback() {

		// Unbind the event handler when the element is disconnected
		this._$button.removeEventListener('click', this._buttonClickHandler);
	}
}

window.customElements.define('material-btn', MaterialBtn);
