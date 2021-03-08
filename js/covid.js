(async function main() {
    const baseEndpoint = 'https://restcountries.herokuapp.com/api/v1';
    //const proxy = 'https://api.allorigins.win/raw?url';
    const proxy = 'https://api.codetabs.com/v1/proxy/?quest=';
    const covidStat = "https://corona-api.com/countries"
    const categories = document.querySelector('#categories');
    const btnCountry = document.querySelector('#btnCountry');
    const modal = document.getElementById("modal");
    var ctx = document.getElementById('myChart');
    let myChart, state;
    let lclDB = [{ continentId: 0, continentName: "Asia", covidData: [] },
    { continentId: 1, continentName: "Europe", covidData: [] },
    { continentId: 2, continentName: "Americas", covidData: [] },
    { continentId: 3, continentName: "Africa", covidData: [] },
    { continentId: 4, continentName: "Oceania", covidData: [] }];
    let catArr = [];
    let continentCounrty, covidDB;
    const getStat = async () => {
        let callApi = await fetch(covidStat);
        let result = await callApi.json();
        // console.log(result.data)

        covidDB = (result.data).map((u) => {
            let country = u.latest_data;
            catArr.push(`<option value="${u.name}">${u.name}</option>`)
            return {
                name: u.name, Confirmed: country.confirmed,
                Deaths: country.deaths, recovered: country.recovered, critical: country.critical
            }
        })
        categories.innerHTML = catArr;
     
      
        // console.log(covidDB)
        return covidDB;
    }
    getStat();
    
    async function display (){
  ///////////////////////////////
        
   state  = covidDB.filter((DataOfCountry) => (DataOfCountry.name == categories.value));
        console.log(state)  
    	document.getElementsByClassName("text").innerHTML= "11111";
        await displayModal();
   }
  
   
   const getCountryByContinent = async (continent) => {
        const response = await fetch(`${proxy}${baseEndpoint}`);
        const data = await response.json();

        // console.log(data)

        let countriesByRegion = data.map((u) => {
            let countryByRegion = u.name;
            return {
                name: countryByRegion.common, region: u.region
            }
        })
        let res = countriesByRegion.filter(state => state.region == continent)
        // console.log(res)
        continentCounrty = res.map(country => country.name)
        // console.log(continentCounrty)

        return continentCounrty;
    }
    for (const continent of lclDB) {
        const countries = await getCountryByContinent(continent.continentName);
        continent.covidData = covidDB.filter((covidDataOfCountry) => countries.includes(covidDataOfCountry.name));
    }

    setCountries = async (num) => {
        // for (let i = 0; i < myChart.data.labels.length; i++) {
        //       removeData(myChart)
        // }
        initChart();
        const lclDBLine = lclDB[num];
        for (let j = 0; j < lclDBLine.covidData.length; j++) {
            addData(myChart, lclDBLine.covidData[j].name, lclDBLine.covidData[j].Deaths);
        }
        //  console.log(myChart.data.labels.length)
    }
    btnCountry.addEventListener('click', display);
    function initChart() {
        if (myChart) {
            myChart.destroy();
        }
        myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Covid',
                    axisX: {
                        labelAngle: -30
                    },
                    data: [],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });
    }
    initChart();
    document.getElementById("body").appendChild(ctx);
    function addData(chart, label, data) {
        chart.data.labels.push(label);
        chart.data.datasets.forEach((dataset) => {
            dataset.data.push(data);
        });
        chart.update();
    }
    function removeData(chart) {
        chart.data.labels.pop();
        chart.data.datasets.forEach((dataset) => {
            dataset.data.pop();
        });
        chart.update();
    }
    function displayModal() {
        const modalClose = document.getElementsByClassName("close")[0];
            modal.style.display= "block";
        
            modalClose.onclick = function() {
                modal.style.display = "none";
            };
      
            window.onclick = function(event) {
                if (event.target == modal) {
                    modal.style.display = "none";
                }
            };
        }
})()