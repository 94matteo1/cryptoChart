export function createChartData() {
    const chartData_Component = document.createElement('template');

    chartData_Component.innerHTML = `
    
        <style>
    
        .custom-props
        {
            --width:null;
            --height:null;
        }
    
    
        .background{
            width:var(--width);
            height:var(--height);
            display:flex;
            justify-content:center;
            align-items:center;
         
        }
    
        .data-container{
            width:95%;
            height:95%;
            display:flex;
            align-items:center;
            flex-direction:row;
        }
    
        .container-icon-and-name{
            width:25%;
            display:flex;
            align-items:center;
            flex-direction:row;
        }
    
        .container-cripto-data{
            width:75%;
            display:flex;
            align-items:center;
            flex-direction:row;
            justify-content:center;
        }
    
        .container-icon{
            width:40px;
            height:40px;
            background-image: var(--icon);
            background-position: center bottom;
            background-repeat: no-repeat;
            background-size: cover;
        }
    
        .coin-name{
            text-transform: capitalize;
            font-family: 'Roboto', sans-serif;
            font-size: large;
            font-weight:600;
            color: #58667e;
            display:block;
        }
    
        .container-single-text{
            margin-left:50px;
            line-height: 1.25em;
        }
    
        .text-data-title{
            color: #58667e;
            font-family: 'Roboto', sans-serif;
            font-weight:600;
            font-size: small;
        }
    
        .text-data{
            color: #000;
            font-family: 'Roboto', sans-serif;
            font-weight:600;
            font-size: medium;
        }
    
        .container-text-and-data{
            display:flex;
            align-items:center;
            flex-direction:column;
        }
    
        </style>
        
        <div class="background" id="background">
            <div class="data-container">
    
                <div class="container-icon-and-name">
                    <div class="container-icon" id="icon"></div>
    
                    <div style="margin-left:20px">
                        <h class="coin-name" id="coin-name"></h>
                    </div>
                </div>
    
                <div class="container-cripto-data">
    
                    <div class="container-single-text">
                        <div class="container-text-and-data">
                            <h class="text-data-title">Bitcoin Price (BTC)</h>
                            <h class="text-data" id="coin-price"></h>
                        </div>
                    </div>
    
                    <div class="container-single-text">
                        <div class="container-text-and-data">
                            <h class="text-data-title">24 Hour Price Change</h>
                            <h class="text-data" id="coin-price-24h-change"></h>
                        </div>
                    </div>
    
                    <div class="container-single-text">
                        <div class="container-text-and-data">
                            <h class="text-data-title">7 Days Price Change</h>
                            <h class="text-data" id="coin-price-7d-change"></h>
                        </div>
                    </div>
    
                    <div class="container-single-text">
                        <div class="container-text-and-data">
                            <h class="text-data-title">24 Hour High</h>
                            <h class="text-data" id="coin-price-24h-high"></h>
                        </div>
                    </div>
    
                    <div class="container-single-text">
                        <div class="container-text-and-data">
                            <h class="text-data-title">24 Hour Low</h>
                            <h class="text-data" id="coin-price-24h-low"></h>
                        </div>
                    </div>
    
                </div>
            </div>
        </div>
    `;

    customElements.define('chart-data',
        class extends HTMLElement {
            constructor() {
                super();

                const templateContent = chartData_Component.content;

                this.attachShadow({
                    mode: 'open'
                }).appendChild(
                    templateContent.cloneNode(true)
                );
            }

            connectedCallback() {
                this.setStyleData();
                this.fetchData();
            };

            setStyleData() {
                var background = this.shadowRoot.getElementById('background');

                background.style.setProperty("--width", this.getAttribute("width"));
                background.style.setProperty("--height", this.getAttribute("height"));
            };

            fetchData() {
                fetch('https://api.coingecko.com/api/v3/coins/' + this.getAttribute("coin"))
                    .then(
                        (response) => {
                            if (response.status !== 200) {
                                console.log('Looks like there was a problem. Status Code: ' + response.status);
                                return;
                            }
                            response.json().then((data) => {
                                this.plotData(data)

                            })
                        })
                    .catch(function (err) {
                        console.log('Fetch Error :-S', err);
                    });
            };

            plotData(data) {
                var iconContainer = this.shadowRoot.getElementById('icon');
                var icon = data.image.small;
                iconContainer.style.setProperty("--icon", `url(${icon})`);

                var coinName = data.id;
                var coinNameText = this.shadowRoot.getElementById('coin-name');
                coinNameText.innerHTML = coinName;

                var coinUsdPrice = data.market_data.current_price.usd;
                var coinUsdPriceText = this.shadowRoot.getElementById('coin-price');
                coinUsdPriceText.innerHTML = "$ " + coinUsdPrice;

                var coin24hPriceChange = data.market_data.price_change_percentage_24h;
                var coin24hPriceChangeText = this.shadowRoot.getElementById('coin-price-24h-change');
                coin24hPriceChangeText.innerHTML = coin24hPriceChange.toFixed(2) + " %";

                var coin7DPriceChange = data.market_data.price_change_percentage_7d;
                var coin7DPriceChangeText = this.shadowRoot.getElementById('coin-price-7d-change');
                coin7DPriceChangeText.innerHTML = coin7DPriceChange.toFixed(2) + " %";


                var coin24hPriceHigh = data.market_data.high_24h.usd;
                var coin24hPriceHighText = this.shadowRoot.getElementById('coin-price-24h-high');
                coin24hPriceHighText.innerHTML = "$ " + coin24hPriceHigh;

                var coin24hPriceLow = data.market_data.low_24h.usd;
                var coin24hPriceLowText = this.shadowRoot.getElementById('coin-price-24h-low');
                coin24hPriceLowText.innerHTML = "$ " + coin24hPriceLow;

            };
        }
    );



}
