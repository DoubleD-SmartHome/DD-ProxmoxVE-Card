class DFProxmoxCard extends HTMLElement {
  // Whenever the state changes, a new `hass` object is set. Use this to
  // update your content.
  set hass(hass) {
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
    const STATUS = hass.states['binary_sensor.'+this.config.device+'_status'] ? hass.states['binary_sensor.'+this.config.device+'_status'].state : "unavailable";
    const SSL_DATE = hass.states[this.config.ssl] ? new Date(hass.states[this.config.ssl].state) : "unavailable";
    const SSL_STATUS = "red";

    this.content.innerHTML = `
	<div class="df-proxmox-container">
	  <div class="Logo">
	    <div id="logo" title="" class="" style="height: 80%; background: center / contain no-repeat url('/local/community/DD-ProxmoxVE-Card/assets/${LOGO}.png');"></div>
	  </div>
	  <div class="Main">
	    <div class="Name">${DEVICE_NAME}</div>
	    <div class="Uptime">${STARTUP}</div>
	    <div class="Other">${UPTIME}</div>
	  </div>
	  <div class="Actions">
	    <div class="MainAction">
	      <div id="status" title="" class="" style="height: 100%; background: center / contain no-repeat url('/local/community/DD-ProxmoxVE-Card/assets/${TYPE}_${STATUS}.png');"></div>
	    </div>
	    <div class="SSL">
	      <div id="status" title="${SSL_DATE}" class="" style="height: 100%; background: center / contain no-repeat url('/local/community/DD-ProxmoxVE-Card/assets/SSL-${SSL_STATUS}.png');"></div>
            </div>
	  </div>
	  <div class="CPU">
            <span>${RAM}%</span>
            <span>CPU</span>
	  </div>
	  <div class="RAM">${RAM}%</div>
	  <div class="HDD">${HDD}%</div>
	  <div class="Swap">${SWP}%</div>
	  <div class="Network">
            ${NETIN}
            ${NETOUT}
          </div>
	</div>
    `;
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
      grid_rows: 4,
      grid_columns: 4,
      grid_min_rows: 4,
      grid_max_rows: 4,
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
