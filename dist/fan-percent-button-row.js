window.customCards = window.customCards || [];
window.customCards.push({
  type: "fan-percent-button-row",
  name: "fan percent button row",
  description: "A plugin to display your fan controls in a button row.",
  preview: false,
});

class CustomFanPercentRow extends Polymer.Element {

	static get template() {
		return Polymer.html`
			<style is="custom-style" include="iron-flex iron-flex-alignment"></style>
			<style>
				:host {
					line-height: inherit;
				}
				.percentage {
					margin-left: 2px;
					margin-right: 2px;
					background-color: #759aaa;
					border: 1px solid lightgrey; 
					border-radius: 4px;
					font-size: 10px !important;
					color: inherit;
					text-align: center;
					float: right !important;
					padding: 1px;
					cursor: pointer;
				}
				
				</style>
					<hui-generic-entity-row hass="[[hass]]" config="[[_config]]">
						<div class='horizontal justified layout' on-click="stopPropagation">
							<button
								class='percentage'
								style='[[_button1Color]];min-width:[[_width]];max-width:[[_width]];height:[[_height]]'
								toggles name="[[_button1Name]]"
								on-click='setPercentage'
								disabled='[[_button1State]]'>[[_button1Text]]</button>
							<button
								class='percentage'
								style='[[_button2Color]];min-width:[[_width]];max-width:[[_width]];height:[[_height]];[[_hideButton2]]'
								toggles name="[[_button2Name]]"
								on-click='setPercentage'
								disabled='[[_button2State]]'>[[_button2Text]]</button>
							<button
								class='percentage'
								style='[[_button3Color]];min-width:[[_width]];max-width:[[_width]];height:[[_height]];[[_hideButton3]]'
								toggles name="[[_button3Name]]"
								on-click='setPercentage'
								disabled='[[_button3State]]'>[[_button3Text]]</button>
							<button
								class='percentage'
								style='[[_button4Color]];min-width:[[_width]];max-width:[[_width]];height:[[_height]];[[_hideButton4]]'
								toggles name="[[_button4Name]]"
								on-click='setPercentage'
								disabled='[[_button4State]]'>[[_button4Text]]</button>
							<button
								class='percentage'
								style='[[_button5Color]];min-width:[[_width]];max-width:[[_width]];height:[[_height]]'
								toggles name="[[_button5Name]]"
								on-click='setPercentage'
								disabled='[[_button5State]]'>[[_button5Text]]</button>
						</div>
					</hui-generic-entity-row>
		`;
    }

    static get properties() {
		return {
			hass: {
				type: Object,
				observer: 'hassChanged'
			},
				_config: Object,
				_stateObj: Object,
				_button1SP: Number,
				_button2SP: Number,
				_button3SP: Number,
				_button4SP: Number,
				_button5SP: Number,
				_width: String,
				_height: String,
				_button1Color: String,
				_button2Color: String,
				_button3Color: String,
				_button4Color: String,
				_button5Color: String,
				_button1Text: String,
				_button2Text: String,
				_button3Text: String,
				_button4Text: String,
				_button5Text: String,
				_button1Name: String,
				_button2Name: String,
				_button3Name: String,
				_button4Name: String,
				_hideButton2: String,
				_hideButton3: String,
				_hideButton4: String,
				_button1State: Boolean,
				_button2State: Boolean,
				_button3State: Boolean,
				_button4State: Boolean,
				_button5State: Boolean,
				
		}
	}

	setConfig(config) {
		this._config = config;
		
		this._config = {
			customTheme: false,
			customSetpoints: false,
			reverseButtons: false,
			isTwoSpeedFan: false,
			button1Percentage: 100,
			button2Percentage: 66,
			button3Percentage: 33,
			button4Percentage: 1,
			button5Percentage: 0,
			width: '30px',
			height: '30px',
			isOffColor: '#f44c09',
			isOnLowColor: '#43A047',
			isOnMedColor: '#43A047',
			isOnHiColor: '#43A047',
			buttonInactiveColor: '#759aaa',
			custombutton1Text: 'OFF',
			custombutton2Text: 'BRZ',
			custombutton3Text: 'LOW',
			custombutton4Text: 'MED',
			custombutton5Text: 'HIGH',
			...config
		};
	}

	hassChanged(hass) {

		const config = this._config;
		const stateObj = hass.states[config.entity];
		const custTheme = config.customTheme;
		const custSetpoint = config.customSetpoints;
		const revButtons = config.reverseButtons;
		const twoSpdFan = config.isTwoSpeedFan;
		const threeSpdFan = config.isThreeSpeedFan;
		const buttonWidth = config.width;
		const buttonHeight = config.height;
		const onButton1Clr = config.isOnButton1Color;
		const onButton2Clr = config.isOnButton2Color;
		const onButton3Clr = config.isOnButton3Color;
		const onButton4Clr = config.isOnButton4Color;
		const onButton5Clr = config.isOnButton5Color;
		const buttonOffClr = config.buttonInactiveColor;
		const button1Setpoint = config.button1Percentage;
		const button2Setpoint = config.button2Percentage;
		const button3Setpoint = config.button3Percentage;
		const button4Setpoint = config.button4Percentage;
		const offSetpoint = config.button5Percentage;
		const custButton1Txt = config.customButton1Text;
		const custButton2Txt = config.customButton2Text;
		const custButton3Txt = config.customButton3Text;
		const custButton4Txt = config.customButton4Text;
		const custButton5Txt = config.customButton5Text;
						
		let button1Setpoint;
		let button2Setpoint;
		let button3Setpoint;
		let button4Setpoint;
		let button5Setpoint;
		let brz;
		let low;
		let med;
		let high;
		let offState;
		
		if (custSetpoint) {
			button1Setpoint = parseInt(button1Setpoint);
			button3Setpoint = parseInt(button3Setpoint);
			if (parseInt(button4Setpoint) < 1) {
				button4Setpoint = 1;
			} else {
				button4Setpoint =  parseInt(button4Setpoint);
			}
			if (parseInt(button1Setpoint) > 100) {	
				button1Setpoint = 100;
			} else {
				button1Setpoint = parseInt(button1Setpoint);
			}
			if (stateObj && stateObj.attributes) {
				if (stateObj.state == 'on' && stateObj.attributes.percentage > button1Setpoint && stateObj.attributes.percentage <= ((button3Setpoint + button2Setpoint)/2) ) {
					brz = 'on';
				} else if (stateObj.state == 'on' && stateObj.attributes.percentage > ((button3Setpoint + button2Setpoint)/2) && stateObj.attributes.percentage <= ((button4Setpoint + button3Setpoint)/2) ) {
					low = 'on';
				} else if (stateObj.state == 'on' && stateObj.attributes.percentage > ((button4Setpoint + button3Setpoint)/2) && stateObj.attributes.percentage <= ((button5Setpoint + button4Setpoint)/2) ) {
					med = 'on';
				} else if (stateObj.state == 'on' && stateObj.attributes.percentage > ((button5Setpoint + button4Setpoint)/2) && stateObj.attributes.percentage <= 100) {
					high = 'on';
				} else {
					offState = 'on';
				}	
			}
		} else {
			button1Setpoint = parseInt(button1Setpoint);
			button2Setpoint = parseInt(button2Setpoint);
			button3Setpoint = parseInt(button3Setpoint);
			button4Setpoint = parseInt(button4Setpoint);
			button5Setpoint = parseInt(button5Setpoint);
			if (stateObj && stateObj.attributes) {
				if (stateObj.state == 'on' && stateObj.attributes.percentage >= 0 && stateObj.attributes.percentage <= 1) {
					brz = 'on';
				} else if (stateObj.state == 'on' && stateObj.attributes.percentage >= 2 && stateObj.attributes.percentage <= 50) {
					low = 'on';
				} else if (stateObj.state == 'on' && stateObj.attributes.percentage >= 51 && stateObj.attributes.percentage <= 75) {
					med = 'on';
				} else if (stateObj.state == 'on' && stateObj.attributes.percentage >= 76 && stateObj.attributes.percentage <= 100) {
					high = 'on';
				} else {
					offState = 'on';
				}
			}
		}
		
		let button1color;
		let button2color;
		let button3color;
		let button4color;
		let button5color;
		let buttonOffClr

				
		if (custTheme) {
			if (brz == 'on') {
				button1color = 'background-color:' + onButton1Clr;
			} else {
				button1color = 'background-color:' + buttonOffClr;
			}
			if (low == 'on') {
				button2color = 'background-color:' + onButton2Clr;
			} else {
				button2color = 'background-color:' + buttonOffClr;
			}
			if (med == 'on') {
				button3color = 'background-color:'  + onButton3Clr;
			} else {
				button3color = 'background-color:' + buttonOffClr;
			}
			if (high == 'on') {
				button4color = 'background-color:'  + onButton4Clr;
			} else {
				button4color = 'background-color:' + buttonOffClr;
			}
			if (offState == 'on') {
				button5color = 'background-color:'  + onButton5Clr;
			} else {
				button5color = 'background-color:' + buttonOffClr;
			}
		} else {
			if (brz == 'on') {
				button1color = 'background-color: var(--switch-checked-color)';
			} else {
				button1color = 'background-color: var(--switch-unchecked-color)';
			}
			if (low == 'on') {
				button2color = 'background-color: var(--switch-checked-color)';
			} else {
				button2color = 'background-color: var(--switch-unchecked-color)';
			}
			if (med == 'on') {
				button3color = 'background-color: var(--switch-checked-color)';
			} else {
				button3color = 'background-color: var(--switch-unchecked-color)';
			}
			if (high == 'on') {
				button4color = 'background-color: var(--switch-checked-color)';
			} else {
				button4color = 'background-color: var(--switch-unchecked-color)';
			}
			if (offState == 'on') {
				button5color = 'background-color: var(--switch-checked-color)';
			} else {
				button5color = 'background-color: var(--switch-unchecked-color)';
			}
		}

		let button1Text = custButton1Txt;
		let button2Text = custButton2Txt;
		let button3Text = custButton3Txt;
		let button4Text = custButton4Txt;
		let button5Text = custButton5Txt;
		
		let buttonwidth = buttonWidth;
		let buttonheight = buttonHeight;
		
		let button1Name = 'high'
		let button2Name = 'medium'
		let button3Name = 'low'
		let button4Name = 'breeze'
		let button5Name = 'off'
		
		let hideButton2 = 'display:block';
		let hideButton4 = 'display:block';
		let nohide = 'display:block';
		
		if (twoSpdFan) {
			hideButton2 = 'display:none';
			hideButton4 = 'display:none';
		} else {
			hideButton2 = 'display:block';
			hideButton4 = 'display:block';
		}
		if (threeSpdFan) {
			hideButton4 = 'display:none';
		} else {
			hideButton4 = 'display:block';
		}
		
		if (revButtons) {
			this.setProperties({
				_stateObj: stateObj,
				_button1State: high == 'on',
				_button2State: med === 'on',
				_button3State: low === 'on',
				_button4State: brz === 'on',
				_button5State: offState === 'on',
				_width: buttonwidth,
				_height: buttonheight,
				_button1Color: button1color,
				_button2Color: button2color,
				_button3Color: button3color,
				_button4Color: button4color,
				_button5Color: button5color,
				_button1SP: button1Setpoint,
				_button2SP: button2Setpoint,
				_button3SP: button3Setpoint,
				_button4SP: button4Setpoint,
				_button5SP: button5Setpoint,
				_button1Text: button1Text,
				_button2Text: button2Text,
				_button3Text: button3Text,
				_button4Text: button4Text,
				_button5Text: button5Text,
				_button1Name: button1Name,
				_button2Name: button2Name,
				_button3Name: button3Name,
				_button4Name: button4Name,
				_button5Name: button5Name,
				_hidebutton1: hideButton2,
				_hidebutton3: hideButton4,
			});
		} else {
			this.setProperties({
				_stateObj: stateObj,
				_button1State: high == 'on',
				_button2State: med === 'on',
				_button3State: low === 'on',
				_button4State: brz === 'on',
				_button5State: offState === 'on',
				_width: buttonwidth,
				_height: buttonheight,
				_button1Color: button1color,
				_button2Color: button2color,
				_button3Color: button3color,
				_button4Color: button4color,
				_button5Color: button5color,
				_button1SP: button1Setpoint,
				_button2SP: button2Setpoint,
				_button3SP: button3Setpoint,
				_button4SP: button4Setpoint,
				_button5SP: button5Setpoint,
				_button1Text: button1Text,
				_button2Text: button2Text,
				_button3Text: button3Text,
				_button4Text: button4Text,
				_button5Text: button5Text,
				_button1Name: button1Name,
				_button2Name: button2Name,
				_button3Name: button3Name,
				_button4Name: button4Name,
				_button5Name: button5Name,
				_hidebutton1: hideButton2,
				_hidebutton3: hideButton4,
			});
		}
	}

	stopPropagation(e) {
		e.stopPropagation();
	}
	
	setPercentage(e) {
		const level = e.currentTarget.getAttribute('name');
		const param = {entity_id: this._config.entity};
		if( level == 'off' ){
			this.hass.callService('fan', 'turn_off', param);
			param.percentage = this._offSP;
			this.hass.callService('fan', 'set_percentage', param);
		} else if (level == 'brz') {
			param.percentage = this._lowSP;
			this.hass.callService('fan', 'set_percentage', param);
		} else if (level == 'low') {
			param.percentage = this._lowSP;
			this.hass.callService('fan', 'set_percentage', param);
		} else if (level == 'medium') {
			param.percentage = this._medSP;
			this.hass.callService('fan', 'set_percentage', param);
		} else if (level == 'high') {
			param.percentage = this._highSP;
			this.hass.callService('fan', 'set_percentage', param);
		}
	}
}
	
customElements.define('fan-percent-button-row', CustomFanPercentRow);

