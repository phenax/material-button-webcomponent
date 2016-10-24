
// The template element
const $templateEl= document.currentScript.ownerDocument.getElementById('materialBtn');


class MaterialBtn extends HTMLElement {

	constructor() {
		super();

		this.DEFAULT_COLOR= '#3F51B5';

		// Bind methods to current context
		this._buttonClickHandler= this._buttonClickHandler.bind(this);
		this._calculationLoop= this._calculationLoop.bind(this);
		this._renderLoop= this._renderLoop.bind(this);

		// Shadow root
		this._root= this.attachShadow({ mode: 'open' });
		this._root.appendChild($templateEl.content.cloneNode(true));
	}


	connectedCallback() {

		this._$textEl= this._root.querySelector('.js-text');
		this._$ripple= this._root.querySelector('.js-ripple');

		this._setUpComponent();
	}



	// Getter and setter for text inside the button
	get text() { return this._text; }
	set text(text) {
		
		this._text= text;

		this._$textEl.innerHTML= text;
	}

	// Getter and setter for the button color
	get color() { return this._color; }
	set color(color) {

		color= color || this.DEFAULT_COLOR;

		this.style.setProperty('--button-color', color);

		this._color= color;
		this.setAttribute('color', color);
	}

	// Getter and setter for the elevation amount(for box-shadow)
	get elevation() { return this._elevation; }
	set elevation(elevation) {

		// If its not set, dont do shit
		if(!elevation)
			return;

		this.style.setProperty('--button-drop-shadow', elevation);

		this._elevation= elevation;
		this.setAttribute('elevation', elevation);
	}



	// Set up the element and set its attributes
	_setUpComponent() {

		this.color= this.getAttribute('color');
		this.text= this.innerHTML || '';
		this.elevation= this.getAttribute('elevation');

		this.addEventListener('click', this._buttonClickHandler);
	}


	// Click event handler for the button
	_buttonClickHandler(e) {

		this.triggerRipple({
			x: e.pageX,
			y: e.pageY
		});
	}



	// PUBLIC - Triggers a ripple in the button
	// @params clickPos:object = { x: 0, y: 0 } - The click coordinates
	triggerRipple(clickPos) {

		// Prevents ripple when the current animation is processing
		if(this._isAnimating)
			return;

		this._isAnimating= true;


		// set up the initial state and the target state
		this._setupAnimationInitialState(clickPos);


		// Start iterating the frames
		window.requestAnimationFrame(this._calculationLoop);
		window.requestAnimationFrame(this._renderLoop);
	}

	_setupAnimationInitialState(clickPos) {

		const dimens= this.getBoundingClientRect();


		// relative click position(If the clickPos is not set, trigger the ripple from the center)
		this._clickPos= {

			x: (clickPos)? clickPos.x - dimens.left: dimens.width/2,

			y: (clickPos)? clickPos.y - dimens.top: dimens.height/2
		};


		// Dont know what to call this. It does some calculation.
		const calculateOppOrdinate= (size, pos) => ((pos > size/2)? pos: size - pos);


		// current state of the ripple(Goes from the initial state to the final state)
		this._currentRipple= { scale: 0, opacity: 1 };


		// The target state of the ripple
		this._targetRipple= {

			scale: 2* Math.sqrt(

				Math.pow(calculateOppOrdinate(dimens.width, this._clickPos.x),  2) + 

				Math.pow(calculateOppOrdinate(dimens.height, this._clickPos.y), 2)
			),

			opacity: 0,
		};
	}



	// Calculates the styles to be applied on every frame
	_calculationLoop() {

		// current+= (target - current)/strength for easing the increments
		this._currentRipple.scale +=   (this._targetRipple.scale - this._currentRipple.scale)/10;

		this._currentRipple.opacity += (this._targetRipple.opacity - this._currentRipple.opacity)/10;


		// If the opacity crosses a minimum, stop loop
		if( this._currentRipple.opacity <= 0.02 )
			this._isAnimating= false;
		else
			window.requestAnimationFrame(this._calculationLoop);
	}



	// Renders the styles to the screen
	_renderLoop() {

		// apply the styles
		this._$ripple.style.transform= `
			translate(${this._clickPos.x}px, ${this._clickPos.y}px)
			scale(${this._currentRipple.scale})
		`;

		this._$ripple.style.opacity= this._currentRipple.opacity;



		// If the calculation loop has ended, stop animating and reset the styles
		if(this._isAnimating)
			window.requestAnimationFrame(this._renderLoop);
		else {

			this._$ripple.style.transform= 'none';

			this._$ripple.style.opacity= 0;
		}
	}



	disconnectedCallback() {

		// Unbind the event handler when the element is disconnected
		this.removeEventListener('click', this._buttonClickHandler);
	}
}


window.customElements.define(
	
	$templateEl.dataset.tagName, 
	
	MaterialBtn, 
	
	{extends: 'button'}
);
