// helper functions
var helperFunctions = {
//function that returns the annual salary at nth year (years === nth)
myAnnualSalary: function (years) {
  let monthlySalary = +$('#monthlySalary')[0].value,
    annualIncrement = +$('#annualIncrement')[0].value / 100
  let annualSalary

  annualSalary = (monthlySalary * 12) * Math.pow(1 + annualIncrement, years)

  return annualSalary
},
// cpf contribution at nth year
myCPFContribution: function (years) {
  // annual CPF contribution by employee
  return this.myAnnualSalary(years) * 0.2
},

//disposableincome at nth year
myDisposableIncome: function (years) {
  // after expenditure
  let expenditure = +$('#expenditure')[0].value/100

  return (this.myAnnualSalary(years) - this.myCPFContribution(years)) * (1 - expenditure)
},

employerCPFContribution: function (years) {
  // default 16% employer's contribution
  return this.myAnnualSalary(years) * 0.16
},

// calculator
myBankSavings: function (years) {
  let percentageSaved = +$('#savings')[0].value/100,
      savingsRate = +$('#savingsRate')[0].value/100

  if (years === 0) {
    return this.myDisposableIncome(years) * percentageSaved * (1+savingsRate)
  } else {
    return (this.myBankSavings(years - 1) + (this.myDisposableIncome(years) * percentageSaved))* (1+savingsRate)
  }
},

myCPFSavings: function (years) {
  let cpfRate = +$('#cpfRate')[0].value/100

  if (years === 0) {
    return (this.myCPFContribution(years) + this.employerCPFContribution(years)) * (1+cpfRate)
  } else {
    return (this.myCPFSavings(years - 1) + (this.myCPFContribution(years) + this.employerCPFContribution(years))) * (1+cpfRate)
  }
},

myCashSavings: function (years) {
  let cashRate = +$('#cashRate')[0].value/100
      percentageCash = 1 - $('#savings')[0].value/100

  if (years === 0) {
    return this.myDisposableIncome(years)* percentageCash * (1+cashRate)
  } else {
    return (this.myCashSavings(years - 1) + (this.myDisposableIncome(years)*percentageCash)) * (1+cashRate)
  }
},

myTotalNetworth: function () {

  function mySavingsArray () {
    // returns an array of the cumulative savings (bank) generated each year

    let numWorkingYears = retireAge - startAge,
    numRetirementYears = deathAge - retireAge,
    savingsRate = +$('#savingsRate')[0].value/100,
    bankSavingsPerYear = []

    for (var numYears = 0; numYears <= numWorkingYears; numYears++) {
      bankSavingsPerYear.push(helperFunctions.myBankSavings(numYears))
    }

    for (var n = 1; n <= numRetirementYears; n++) {
      bankSavingsPerYear.push(bankSavingsPerYear[bankSavingsPerYear.length-1]*(1+savingsRate))
    }
    return bankSavingsPerYear
  }

  function myCPFArray () {

    let numWorkingYears = retireAge - startAge,
    numRetirementYears = deathAge - retireAge,
    cpfRate = +$('#cpfRate')[0].value/100,
    cpfSavingsPerYear = []

    for (var numYears = 0; numYears <= numWorkingYears; numYears++) {
      cpfSavingsPerYear.push(helperFunctions.myCPFSavings(numYears))
    }

    for (var n = 1; n <= numRetirementYears; n++) {
      cpfSavingsPerYear.push(cpfSavingsPerYear[cpfSavingsPerYear.length-1]*(1+cpfRate))
    }
    return cpfSavingsPerYear
  }

  function myCashArray () {

    let numWorkingYears = retireAge - startAge,
    numRetirementYears = deathAge - retireAge,
    cashRate = +$('#cashRate')[0].value/100,
    accumulatedCashPerYear = []

    for (var numYears = 0; numYears <= numWorkingYears; numYears++) {
      accumulatedCashPerYear.push(helperFunctions.myCashSavings(numYears))
    }

    for (var n = 0; n <= numRetirementYears; n++) {
      accumulatedCashPerYear.push(accumulatedCashPerYear[accumulatedCashPerYear.length-1]*(1+cashRate))
    }
    return accumulatedCashPerYear
  }

  let startAge = +$('#startAge')[0].value,
      retireAge = +$('#retireAge')[0].value,
      deathAge = 100,
      mySavingsArr = mySavingsArray(),
      myCPFArr = myCPFArray(),
      myCashArr = myCashArray()
      dataTable = []

  var totalNetworthArr = mySavingsArr.map(function(val, idx) {
    return val + myCPFArr[idx] + myCashArr[idx]
  })

  for (var age=startAge; age <= deathAge; age++) {
    var yearlyData = [age, totalNetworthArr[age -startAge]]
    dataTable.push(yearlyData)
  }

  return dataTable
}
}

window.addEventListener('DOMContentLoaded', function () {

  var dataSet = helperFunctions.myTotalNetworth()

  google.charts.load('current', {packages: ['corechart', 'line']});
  google.charts.setOnLoadCallback(drawBackgroundColor);

  function drawBackgroundColor() {
        var data = new google.visualization.DataTable();
        data.addColumn('number', 'Years');
        data.addColumn('number', 'Net Worth');


        data.addRows([
        [0, 0],   [1, 10],  [2, 23],  [3, 17],  [4, 18],  [5, 9],
        [6, 11],  [7, 27],  [8, 33],  [9, 40],  [10, 32], [11, 35],
        [12, 30], [13, 40], [14, 42], [15, 47], [16, 44], [17, 48],
        [18, 52], [19, 54], [20, 42], [21, 55], [22, 56], [23, 57],
        [24, 60], [25, 50], [26, 52], [27, 51], [28, 49], [29, 53],
        [30, 55], [31, 60], [32, 61], [33, 59], [34, 62], [35, 65],
        [36, 62], [37, 58], [38, 55], [39, 61], [40, 64], [41, 65],
        [42, 63], [43, 66], [44, 67], [45, 69], [46, 69], [47, 70],
        [48, 72], [49, 68], [50, 66], [51, 65], [52, 67], [53, 70],
        [54, 71], [55, 72], [56, 73], [57, 75], [58, 70], [59, 68],
        [60, 64], [61, 60], [62, 65], [63, 67], [64, 68], [65, 69],
        [66, 70], [67, 72], [68, 75], [69, 400]
      ]);
;

        var options = {
          hAxis: {
            title: 'Age'
          },
          vAxis: {
            title: 'Net Worth',
          },
          backgroundColor: '#ffffff',
          colors: ['#d3d3d3'],
          title: 'Net Worth Projection',
          // chartArea:{width:'80%',height:'75%'},
          height: '100%',
          width: '100%'

        };

        var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
        chart.draw(data, options);
      }
})



document.getElementById("networthbtn").addEventListener("click", function() {

  var dataSet = helperFunctions.myTotalNetworth()

  google.charts.load('current', {packages: ['corechart', 'line']});
  google.charts.setOnLoadCallback(drawBackgroundColor);

  function drawBackgroundColor() {
        var data = new google.visualization.DataTable();
        data.addColumn('number', 'Years');
        data.addColumn('number', 'Net Worth');


        data.addRows(dataSet);

        var options = {
          hAxis: {
            title: 'Age'
          },
          vAxis: {
            title: 'Net Worth',
            format: 'currency'
          },
          backgroundColor: '#ffffff',
          pointShape: 'diamond',
          pointSize: 5,
          colors: ['#EF851C'],
          title: 'Net Worth Projection',
          animation:{
        duration: 400,
        easing: 'linear',
        startup: true
      }


        };

        function placeMarker(data) {
          var cli = chart.getChartLayoutInterface();
          var chartArea = cli.getChartAreaBoundingBox();
          document.querySelector('.overlay-marker').style.top = Math.floor(cli.getYLocation(dataSet[dataSet.length-1][1]))+ "px";
          document.querySelector('.overlay-marker').style.left = Math.floor(cli.getXLocation(dataSet[dataSet.length-1][0]))+ "px";
          document.querySelector('.overlay-marker').append(12)
        };

        var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
        chart.draw(data, options);
        placeMarker(dataSet);


      }
});
