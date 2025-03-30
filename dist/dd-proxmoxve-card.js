class DFProxmoxCard extends HTMLElement {
	set hass(hass) {
		const VERSION="0.00.110";
		if (!this.content) {
			this.innerHTML = `
				<link type="text/css" rel="stylesheet" href="/local/community/DD-ProxmoxVE-Card/dd-proxmoxve-card.css">
				<ha-card df>
  					<div class="card-content"></div>
    				</ha-card>
			`;
			this.content = this.querySelector("div");
		}	
		
		let TODAY_DATE  = new Date();

		const DEVICE_NAME = this.config.device;
		const TYPE = DEVICE_NAME.substring(0, DEVICE_NAME.indexOf('_'));
		const LOGO = this.config.logo ? this.config.logo : "logo";
		const STATUS = hass.states['binary_sensor.'+this.config.device+'_status'] ? hass.states['binary_sensor.'+this.config.device+'_status'].state : "unavailable";
		
		let STARTTIME, STARTUP, result, UPTIME;

		if (STATUS==="on") {
			STARTTIME = hass.states['sensor.'+this.config.device+'_last_boot'] ? new Date(hass.states['sensor.'+this.config.device+'_last_boot'].state) : "unavailable";
			STARTUP = "Start: "+STARTTIME.toString().substring(0,24);
			result = calculateTimeDifference(STARTTIME, Date());
			UPTIME = "Uptime: ("+result.days+" Day "+result.hours+" Hrs "+result.minutes+" Mins)";
		}
		else {
			STARTUP = "Not running...";
			UPTIME = "Uptime: (Not running...)";
		}
		
		let myHTML = `
  			<div class="df-proxmox-container">
				<div class="grid-item logo" title="Card Version: ${VERSION}" style="height: 80%; background: center / contain no-repeat url('/local/community/DD-ProxmoxVE-Card/assets/${LOGO}.png');"></div>
				<div class="grid-item main no-overflow">
					<div class="no-overflow">${DEVICE_NAME}</div>
					<div class="no-overflow" title="Started: ${STARTUP}">${UPTIME}</div>
				</div>
				<div class="grid-item status">
					<div class="${STATUS}" style="display: flex; justify-content: center; height:30px;">
						<div title="${STATUS}" class="" style="height: 80%; width: 80%; background: center / contain no-repeat url('/local/community/DD-ProxmoxVE-Card/assets/${TYPE}_${STATUS}.png');"></div>
					</div>
					<div class="" style="display: flex; justify-content: center; height:30px;">
     		`;

		if (this.config.backup) {
			let BACKUP_STATUS = hass.states[this.config.backup] ? hass.states[this.config.backup].state : "unavailable";
			let BACKUP_DATE = hass.states[this.config.backup] ? new Date(hass.states[this.config.backup].attributes.datetime) : "unavailable";
			let BACKUP_SECONDS = Math.abs(TODAY_DATE - BACKUP_DATE);
			let BACKUP_DAYS = Math.round(BACKUP_SECONDS / (1000 * 60 * 60 * 24)*10)/10;
			let BACKUP_COLOR;
			switch(BACKUP_STATUS) {
				case "SUCCESSFUL":
					if (BACKUP_DAYS > 1) {
						BACKUP_COLOR = "goldenrod";
					}
					else {
						BACKUP_COLOR = "darkgreen";
					}
    					break;
  				case "FAILED":
    					BACKUP_COLOR = "goldenrod";
   					break;
 				 default:
					BACKUP_COLOR = "darkred";
			}
			myHTML += `<div id="icon-container" style="width: 32px; float: left;"  title="Last Backup:&#013;${BACKUP_DAYS} ago on ${BACKUP_DATE}"><ha-icon icon="mdi:backup-restore" style="color: ${BACKUP_COLOR};"></ha-icon></div>`;
		}

		if (this.config.ssl) {
			let SSL_DATE = hass.states[this.config.ssl] ? new Date(hass.states[this.config.ssl].state) : "unavailable";
			let SSL_EXP_SECONDS = Math.abs(SSL_DATE - TODAY_DATE);
			let SSL_EXP_DAYS = Math.round(SSL_EXP_SECONDS / (1000 * 60 * 60 * 24)*10)/10;
			let SSL_COLOR;
			switch(true) {
				case (SSL_EXP_DAYS > 7):
					SSL_COLOR = "darkgreen";
					break;
  				case (SSL_EXP_DAYS > 0 && SSL_EXP_DAYS <= 7):
    					SSL_COLOR = "goldenrod";
   					break;
 				 default:
					SSL_COLOR = "darkred";
			}
			myHTML += `<div id="icon-container" style="width: 32px; float: left;" title="SSL Certificate Expires:&#013;${SSL_DATE}&#013;Expires in ${SSL_EXP_DAYS} days"  onclick="alert(this.getAttribute('title'))"><ha-icon icon="mdi:certificate" style="color: ${SSL_COLOR};"></ha-icon></div>`;
		}
/*				<div id="icon-container" style="width: 32px; float: left;" title="Console is (not) working...:&#013;${SSL_DATE}"><ha-icon icon="mdi:console" style="color: darkgreen;"></ha-icon></div>
*/
  		myHTML += `
     					</div>
				</div>	
    				<div class="grid-item stats" style="display: flex; justify-content: center;">
		`;

		const stats = this.config.stats;
        	const statValues = {};
		stats.forEach((stat) => {
			let myStatValue = hass.states['sensor.'+this.config.device+'_'+stat['stat']] ? hass.formatEntityState(hass.states['sensor.'+this.config.device+'_'+stat['stat']]) : "unavailable";
			myHTML += `
   				<div class="stat borderRed" style="width: 75px; float: left; margin: 0 10px 0 10px;" title="">
	   				<div class="stat_label">${stat['display']}</div>
					<div class="stat_value">${myStatValue}</div>
     				</div>
   			`;
		});

		myHTML += `
	 			</div>
				<div class="grid-item actionlabel">
					Actions:
				</div>
				<div class="grid-item actions">
					<button id="ActionStart" title="Start" class="button" ${STATUS == 'on' ? 'disabled' : ''}><ha-icon icon="mdi:play"></ha-icon></button>
					<button id="ActionStop" title="Stop" class="button" ${STATUS == 'on' ? '' : 'disabled'}><ha-icon icon="mdi:stop"></ha-icon></button>
					<button id="ActionShutdown" title="Shutdown" class="button" ${STATUS == 'on' ? '' : 'disabled'}><ha-icon icon="mdi:power"></ha-icon></button>
					<button id="ActionReboot" title="Reboot" class="button" ${STATUS == 'on' ? '' : 'disabled'}><ha-icon icon="mdi:restart"></ha-icon></button>
				</div>
			</div>
		`;

		this.content.innerHTML = myHTML;

		const actionButtons = this.querySelectorAll('[id^="Action"]');
		actionButtons.forEach((actionButton) => {
			actionButton.addEventListener('click', (event) => {
				const actionid = 'button.'+this.config.device+'_'+event.currentTarget.getAttribute('title');
				if (confirm("Event: "+actionid) == true) {
					hass.callService("button", "press", {
						entity_id: actionid,
					}).then(() => {
						confirm("Service call executed successfully!");
					}).catch((error) => {
						confirm("Error occurred while calling the service:", error);
					});
				}
			});
		});
  	}

	// The user supplied configuration. Throw an exception and Home Assistant
	// will render an error card.
	setConfig(config) {
		//if (!config.load_entity) {
		//  throw new Error("You need to define an entity2");
		//}
		this.config = config;
	}
	
	// The height of your card. Home Assistant uses this to automatically
	// distribute all cards over the available columns in masonry view
	getCardSize() {
		return 4;
	}
		
	// The rules for sizing your card in the grid in sections view
	getLayoutOptions() {
		return {
			grid_rows: 3,
			grid_columns: 4,
			grid_min_rows: 3,
			grid_max_rows: 3,
		};
	}
		
	static getStubConfig() {
		return { device: "lxc_name_number" }
	}
}

class DFProxmoxCardEditor extends HTMLElement {
  setConfig(config) {
    this.config = config || {};
    this.renderEditor();
  }

  renderEditor() {
    this.innerHTML = `
      <div style="padding: 16px;">
        <label for="device">Device:</label>
        <input id="device" type="text" value="${this.config.device || ""}">
        <br><br>
        <label for="logo">Logo:</label>
        <input id="logo" type="text" value="${this.config.logo || ""}">
        <br><br>
        <label for="ssl">SSL Sensor:</label>
        <input id="ssl" type="text" value="${this.config.ssl || ""}">
        <br><br>
        <label for="stats">Stats (comma-separated):</label>
        <textarea id="stats">${JSON.stringify(this.config.stats || [])}</textarea>
        <br><br>
      </div>
    `;

    this.querySelector("#device").addEventListener("input", (event) => {
      this.config.device = event.target.value;
      this.dispatchConfig();
    });

    this.querySelector("#logo").addEventListener("input", (event) => {
      this.config.logo = event.target.value;
      this.dispatchConfig();
    });

    this.querySelector("#ssl").addEventListener("input", (event) => {
      this.config.ssl = event.target.value;
      this.dispatchConfig();
    });

    this.querySelector("#stats").addEventListener("input", (event) => {
      try {
        this.config.stats = JSON.parse(event.target.value);
      } catch (err) {
        console.error("Invalid stats JSON!");
      }
      this.dispatchConfig();
    });
  }

  dispatchConfig() {
    const event = new Event("config-changed", {
      bubbles: true,
      composed: true,
    });
    event.detail = { config: this.config };
    this.dispatchEvent(event);
  }
}

customElements.define("df-proxmox-card", DFProxmoxCard);
customElements.define("df-proxmox-card-editor", DFProxmoxCardEditor);

// Add card type to the Home Assistant card registry
window.customCards = window.customCards || [];
window.customCards.push({
	type: 'df-proxmox-card',
	name: 'DD Proxmox VE Card',
	description: 'a DoubleD Proxmox VE Card for Container and VMs.',
	preview: true,
});

function calculateTimeDifference(startDate, endDate) {
	// Convert dates to milliseconds
	const start = new Date(startDate).getTime();
	const end = new Date(endDate).getTime();
	// Calculate the difference in milliseconds
	const difference = end - start;
	// Calculate days, hours, minutes, and seconds
	const days = Math.floor(difference / (1000 * 60 * 60 * 24));
	const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
	const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
	const seconds = Math.floor((difference % (1000 * 60)) / 1000);
	return { days, hours, minutes, seconds };
}
