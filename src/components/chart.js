import Chart from 'chart.js';

export function createChart() {

    const chart_Component = document.createElement('template');

    chart_Component.innerHTML = `

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

    }

    .canvas{
        height:100% !important;;
        width:100% !important;;
    }
    </style>
    
    <div class="background" id="background">

        <div class="data-container">
            <canvas class="canvas" id="myChart"></canvas>
        </div>
       
    </div>
`;


    customElements.define('main-chart',
        class extends HTMLElement {
            constructor() {
                super();

                const templateContent = chart_Component.content;

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
                            })
                        })
                    .catch(function (err) {
                        console.log('Fetch Error :-S', err);
                    });
            };

            plotChart(data) {
                var ctx = this.shadowRoot.getElementById('myChart')

                var prices = data.prices.map((element) => element[1]);
                var timeStamp = data.prices.map((element) => element[0]);

                var chart = new Chart(ctx, {
                    // The type of chart we want to create
                    type: 'line',

                    // The data for our dataset
                    data: {
                        labels: timeStamp,
                        datasets: [{
                            label: null,
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
                                ticks: {
                                    fontColor: "#CCC",
                                    callback: function (value) {

                                        if (value > 1000)
                                            return "$ " + (value) / 1000 + " k";
                                        else
                                            return "$ " + value
                                    }
                                },
                                gridLines: {
                                    color: "rgba(239, 242, 245, 0.3)",
                                }
                            }],
                            xAxes: [{
                                type: 'time',
                                time: {
                                    unit: 'hour'
                                },
                                ticks: {
                                    fontColor: "#CCC",
                                },
                                gridLines: {
                                    color: "rgba(0, 0, 0, 0)",
                                }
                            }]
                        },
                        elements: {
                            point: {
                                radius: 0
                            }
                        }
                    }
                });
            }
        }
    );

}
