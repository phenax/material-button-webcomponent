# Material Button WebComponent
Experimenting with the customElements v1 spec.

*Note: To use it for production, use customElements v1 polyfill and build the material-button.js to es5. 
Check for support <a href='http://caniuse.com/#search=custom%20Elements%20v1'>here</a>.
As of now, customElements v1 is only supported on Chrome 54.*

<br />

### Usage

* Install with npm ```npm install --save material-button-webcomponent``` or clone this repo.

* Import the html inside the head
```html
  <link rel="import" async href="./node_modules/material-button-webcomponentmaterial-button.html" />
```

* Use the button wherever you want.
```html
  <material-button elevation='2px' color='#f44336'>Click me</material-button>
```

