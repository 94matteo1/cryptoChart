import Chart from 'chart.js';

export function createPriceCangeData(){
    const priceChange_Component = document.createElement('template');


    priceChange_Component.innerHTML = `

    <style>
    .custom-props
    {
        --icon:null;
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
        width:80%;
        height:80%;
    }

    .container-text{
        width:100%;
        height:60%;
        display:flex;
    }

    .container-text-center{
        width:50%;
        height:100%;
        margin-left:15px;
    }

    .container-icon{
        width:30px;
        height:30px;
        background-image: var(--icon);
        background-position: center bottom;
        background-repeat: no-repeat;
        background-size: cover;
    }

    .container-single-text{
        margin-top:7px;
    }

    .coin-name{
        text-transform: capitalize;
        font-family: 'Roboto', sans-serif;
        font-size: medium;
        font-weight:600;
        color: #58667e;
        display:block;
    }


    .coin-price{
        text-transform: uppercase;
        font-family: 'Roboto', sans-serif;
        font-weight:800;
        font-size: large;
        color: #000;
    }

    .coin-price-24h-change{

        font-size: medium;
        font-family: 'Roboto', sans-serif;
        font-weight:800;
        color:green;
    }

    .container-chart{
        width:100%;
        height:40%;

    }

    .canvas-chart{
       height:100% !important;;
       width:100% !important;;

    }


    </style>
    
    <div class="background" id="background">
       <div class="data-container">
            <div class="container-text">
                <div class="container-icon" id="icon"></div>
                <div class="container-text-center">
                    <div class="container-single-text">
                        <h class="coin-name" id="coin-name"></h>
                    </div>
                    <div class="container-single-text">
                        <h class="coin-price" id="coin-price"></h>
                    </div>
                    <div class="container-single-text">
                        <h class="coin-price-24h-change" id="coin-price-24h-change"></h>
                    </div>
                </div>
            </div>
            <div class="container-chart">
                <canvas class="canvas-chart" id="chart"></canvas>
            </div>
       </div>
    </div>

`;


    customElements.define('price-change',
        class extends HTMLElement {
            constructor() {
                super();


                const templateContent = priceChange_Component.content;
  

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
                fetch('https://api.coingecko.com/api/v3/coins/' + this.getAttribute("coin") + '/market_chart?vs_currency=usd&days=1')
                    .then(
                        (response) => {
                            if (response.status !== 200) {
                                console.log('Looks like there was a problem. Status Code: ' + response.status);
                                return;
                            }
                            response.json().then((data) => {
                                this.plotChart(data);
                                this.plotData();
                            })
                        })
                    .catch(function (err) {
                        console.log('Fetch Error :-S', err);
                    });
            };

            plotChart(data) {

                var ctx = this.shadowRoot.getElementById('chart')

                var prices = data.prices.map((element) => element[1]);
                var timeStamp = data.prices.map((element) => element[0]);

                var chart = new Chart(ctx, {
                    // The type of chart we want to create
                    type: 'line',

                    // The data for our dataset
                    data: {
                        labels: timeStamp,
                        datasets: [{
                            label: 'Bitcoin Price',
                            backgroundColor: 'rgba(255,255, 255, 0.0)',
                            borderColor: 'rgb(228, 175, 255)',
                            data: prices
                        }]
                    },

                    options: {
                        legend: {
                            display: false
                        },
                        scales: {
                            yAxes: [{
                                display: false,
                            }],
                            xAxes: [{
                                display: false,
                            }]
                        },
                        elements: {
                            point: {
                                radius: 0
                            }
                        }
                    }
                });
            };

            plotData() {
                fetch('https://api.coingecko.com/api/v3/coins/' + this.getAttribute("coin"))
                    .then(
                        (response) => {
                            if (response.status !== 200) {
                                console.log('Looks like there was a problem. Status Code: ' + response.status);
                                return;
                            }
                            response.json().then((data) => {

                                var iconContainer = this.shadowRoot.getElementById('icon');
                                var icon = data.image.small;
                                iconContainer.style.setProperty("--icon", `url(${icon})`);

                                var coinName = data.id;
                                var coinNameText = this.shadowRoot.getElementById('coin-name');
                                coinNameText.innerHTML = coinName;

                                var coinUsdPrice = data.market_data.current_price.usd;
                                var coinUsdPriceText = this.shadowRoot.getElementById('coin-price');
                                if (coinUsdPrice > 100)
                                    coinUsdPriceText.innerHTML = "$ " + coinUsdPrice;
                                else
                                    coinUsdPriceText.innerHTML = "$ " + coinUsdPrice.toFixed(4);


                                var coin24hPriceChange = data.market_data.price_change_percentage_24h;
                                var coin24hPriceChangeText = this.shadowRoot.getElementById('coin-price-24h-change');
                                coin24hPriceChangeText.innerHTML = coin24hPriceChange.toFixed(2) + " %";


                            })
                        })
                    .catch(function (err) {
                        console.log('Fetch Error :-S', err);
                    });

            };


        }
    );



}
