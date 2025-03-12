class MyCustomCard2 extends HTMLElement {
  setConfig(config) {
    this._config = config;
  }

  getCardSize() {
    return 1;
  }

  connectedCallback() {
    this.innerHTML = `
      <style>
        .card {
          padding: 10px;
          background-color: lightcoral;
          border-radius: 10px;
        }
      </style>
      <div class="card">
        <h1>Card 2</h1>
        <p>This is another custom Lovelace card!</p>
      </div>
    `;
  }
}

customElements.define('my-custom-card2', MyCustomCard2);
