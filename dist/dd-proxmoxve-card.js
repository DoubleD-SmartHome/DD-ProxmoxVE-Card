class DFProxmoxCard extends HTMLElement {
	// 2025-03-19 @ 2:23pm
	// Whenever the state changes, a new `hass` object is set. Use this to
	// update your content.
	set hass(hass) {
		const VERSION="0.00.007";
		// Initialize the content if it's not there yet.
		if (!this.content) {
			this.innerHTML = `
				<link type="text/css" rel="stylesheet" href="/local/community/DD-ProxmoxVE-Card/dd-proxmoxve-card.css">
				<ha-card df>
  					<div class="card-content"></div>
    				</ha-card>
			`;
			this.content = this.querySelector("div");
		}

		const DEVICE_NAME = this.config.device;
		const TYPE = DEVICE_NAME.substring(0, DEVICE_NAME.indexOf('_'));
		const LOGO = this.config.logo ? this.config.logo : "logo";
		const STATUS = hass.states['binary_sensor.'+this.config.device+'_status'] ? hass.states['binary_sensor.'+this.config.device+'_status'].state : "unavailable";
		if (STATUS==="on") {
			const STARTTIME = hass.states['sensor.'+this.config.device+'_last_boot'] ? new Date(hass.states['sensor.'+this.config.device+'_last_boot'].state) : "unavailable";
			const STARTUP = "Start: "+STARTTIME.toString().substring(0,24);
			const result = calculateTimeDifference(STARTTIME, Date());
			const UPTIME = "Uptime: ("+result.days+" Day "+result.hours+" Hrs "+result.minutes+" Mins)";
			const CPU = hass.states['sensor.'+this.config.device+'_cpu_used'] ? parseFloat(hass.states['sensor.'+this.config.device+'_cpu_used'].state).toFixed(2) : "unavailable";
			const RAM = hass.states['sensor.'+this.config.device+'_memory_used_percentage'] ? parseFloat(hass.states['sensor.'+this.config.device+'_memory_used_percentage'].state).toFixed(2) : "unavailable";
			const HDD = hass.states['sensor.'+this.config.device+'_disk_used_percentage'] ? parseFloat(hass.states['sensor.'+this.config.device+'_disk_used_percentage'].state).toFixed(2) : "unavailable";
			const SWP = hass.states['sensor.'+this.config.device+'_swap_used_percentage'] ? parseFloat(hass.states['sensor.'+this.config.device+'_swap_used_percentage'].state).toFixed(2) : "unavailable";
			const NETIN = hass.states['sensor.'+this.config.device+'_network_in'] ? parseFloat(hass.states['sensor.'+this.config.device+'_network_in'].state).toFixed(2) : "unavailable";
			const NETOUT = hass.states['sensor.'+this.config.device+'_network_out'] ? parseFloat(hass.states['sensor.'+this.config.device+'_network_out'].state).toFixed(2) : "unavailable";
			const SSL_DATE = hass.states[this.config.ssl] ? new Date(hass.states[this.config.ssl].state) : "unavailable";
			const SSL_EXP_SECONDS = Math.abs(SSL_DATE - SSL_DATE);
			const SSL_EXP_DAYS = Math.floor(SSL_EXP_SECONDS / (1000 * 60 * 60 * 24));
			const SSL_STATUS = "red";
		}
		else {
			const UPTIME = "Not running...";
			const CPU = "--.-";
			const RAM = "--.-";
			const HDD = "--.-";
			const SWP = "--.-";
			const NETIN = "--.-";
			const NETOUT = "--.-";
			const SSL_DATE = "unavailable";
			const SSL_STATUS = "unavailable";
		}
		
		this.content.innerHTML = `
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
						<div id="icon-container" style="width: 32px; float: left;"  title="Last Backup:&#013;${SSL_DATE}"><ha-icon icon="mdi:backup-restore" style="color: goldenrod;"></ha-icon></div>
						<div id="icon-container" style="width: 32px; float: left;" title="SSL Certificate Expires:&#013;${SSL_DATE}"><ha-icon icon="mdi:certificate" style="color: darkgreen;"></ha-icon></div>
						<div id="icon-container" style="width: 32px; float: left;" title="SSL Certificate Expires:&#013;${SSL_DATE}"><ha-icon icon="mdi:console" style="color: darkgreen;"></ha-icon></div>
					</div>
				</div>
				<div class="grid-item stat1 df-dark_supported">
					<div class="STAT_VALUE df-dark_supported">S1i</div>
				</div>
				<div class="grid-item stat2 df-dark_supported">
					<div class="STAT_VALUE df-dark_supported">${RAM}%</div>
				</div>
				<div class="grid-item stat3 df-dark_supported">
					<div class="STAT_VALUE df-dark_supported">${RAM}%</div>
				</div>
				<div class="grid-item stat4 df-dark_supported">
					<div class="STAT_VALUE df-dark_supported">${RAM}%</div>
				</div>
				<div class="grid-item stat5 df-dark_supported">
					<div class="STAT_VALUE df-dark_supported">${RAM}%</div>
				</div>
				<div class="grid-item stat6 df-dark_supported">
					<div class="STAT_VALUE df-dark_supported">${RAM}%</div>
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
		
		const actionButtons = this.querySelectorAll('[id^="Action"]');
		actionButtons.forEach((actionButton) => {
			actionButton.addEventListener('click', (event) => {
				const actionid = 'button.'+this.config.device+'_'+event.currentTarget.getAttribute('title');
				if (confirm("Event: "+actionid) == true) {
					hass.callService('button', 'press', {
						entity_id: actionid,
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

customElements.define("df-proxmox-card", DFProxmoxCard);

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
