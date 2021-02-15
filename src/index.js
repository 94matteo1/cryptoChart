import {createCard} from  './components/card'
import {createChartData} from  './components/chartData'
import {createChart} from  './components/chart'
import {createPriceCangeData} from  './components/priceChange'

const renderChartsAndData = () => {
    createCard();
    createChartData();
    createChart();
    createPriceCangeData();
};

document.addEventListener('DOMContentLoaded', function() {
    renderChartsAndData();
;
}, false);



