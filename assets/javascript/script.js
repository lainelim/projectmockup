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
    var yearlyData = [age, mySavingsArr[age - startAge], myCashArr[age - startAge], myCPFArr[age - startAge]]
    dataTable.push(yearlyData)
  }

  return dataTable
},

assetBreakdown: function(){
  var pieChartData =[]
  var assetType = ['Savings', 'Cash', 'CPF']
  var data = helperFunctions.myTotalNetworth()[helperFunctions.myTotalNetworth().length - 1]
  assetType.forEach(function(asset){
    var dataSubArr = [asset, data[assetType.indexOf(asset) + 1]]
    pieChartData.push(dataSubArr)
  })
  return pieChartData

}
}

document.getElementById("networthbtn").addEventListener("click", function() {

  var dataSet = helperFunctions.myTotalNetworth()

  google.charts.load('current', {packages: ['corechart']});
  google.charts.setOnLoadCallback(drawBackgroundColor);

  function drawBackgroundColor() {
        var data = new google.visualization.DataTable();
        data.addColumn('number', 'Years');
        data.addColumn('number', 'Savings');
        data.addColumn('number', 'Cash');
        data.addColumn('number', 'CPF');


        data.addRows(dataSet);

        var options = {
          hAxis: {
            title: 'Age'
          },
          vAxis: {
            title: 'SGD',
            format: 'currency'
          },
          isStacked: true,
          backgroundColor: '#ffffff',
          colors: ['#2E4052','#96E6B3', '#FFC857'],
          title: 'Net Worth Projection',
          animation:{
        duration: 400,
        easing: 'linear',
        startup: true
      }



        };

        var pieDataSet = helperFunctions.assetBreakdown()

        var piedata = new google.visualization.DataTable();
        piedata.addColumn('string', 'Asset Type');
        piedata.addColumn('number', 'Amount');
        piedata.addRows(pieDataSet);

        var piechart_options = {title:'Pie Chart: Networth Breakdown at Age 100',
                       width:400,
                       height:300,
                       is3D: true,
                       colors: ['#2E4052','#96E6B3', '#FFC857']
                     };
        var piechart = new google.visualization.PieChart(document.getElementById('pie-chart'));
        piechart.draw(piedata, piechart_options);


        var chart = new google.visualization.AreaChart(document.getElementById('chart_div'));
        chart.draw(data, options);
      }
});
