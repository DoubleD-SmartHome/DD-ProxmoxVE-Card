class MyCustomCard1 extends HTMLElement {
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
          background-color: lightblue;
          border-radius: 10px;
        }
      </style>
      <div class="card">
        <h1>Card 1</h1>
        <p>This is a simple custom Lovelace card!</p>
      </div>
    `;
  }
}

customElements.define('my-custom-card1', MyCustomCard1);
