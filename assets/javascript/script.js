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
  let expenditure = +$('#expenditure')[0].value

  return (this.myAnnualSalary(years) - this.myCPFContribution(years)) * (1 - expenditure)
},

employerCPFContribution: function (years) {
  // default 16% employer's contribution
  return this.myAnnualSalary(years) * 0.16
},

// calculator
myBankSavings: function (years) {
  let percentageSaved = +$('#savings')[0].value,
      savingsRate = +$('#savingsRate')[0].value

  if (years === 0) {
    return this.myDisposableIncome(years) * percentageSaved * (1+savingsRate)
  } else {
    return (this.myBankSavings(years - 1) + (this.myDisposableIncome(years) * percentageSaved))* (1+savingsRate)
  }
},

myCPFSavings: function (years) {
  let cpfRate = +$('#cpfRate')[0].value

  if (years === 0) {
    return (this.myCPFContribution(years) + this.employerCPFContribution(years)) * (1+cpfRate)
  } else {
    return (this.myCPFSavings(years - 1) + (this.myCPFContribution(years) + this.employerCPFContribution(years))) * (1+cpfRate)
  }
},

myCashSavings: function (years) {
  let cashRate = +$('#cashRate')[0].value
      percentageCash = 1 - $('#savings')[0].value

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
    savingsRate = +$('#savingsRate')[0].value,
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
    cpfRate = +$('#cpfRate')[0].value,
    cpfSavingsPerYear = []

    for (var numYears = 0; numYears <= numWorkingYears; numYears++) {
      cpfSavingsPerYear.push(helperFunctions.myCPFSavings(numYears))
    }

    for (var n = 1; n <= numRetirementYears; n++) {
      console.log("cpf savings after retirement", cpfSavingsPerYear[cpfSavingsPerYear.length-1])
      cpfSavingsPerYear.push(cpfSavingsPerYear[cpfSavingsPerYear.length-1]*(1+cpfRate))
    }
    return cpfSavingsPerYear
  }

  function myCashArray () {

    let numWorkingYears = retireAge - startAge,
    numRetirementYears = deathAge - retireAge,
    cashRate = +$('#cashRate')[0].value,
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
          title: 'Net Worth Projection'


        };

        var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
        chart.draw(data, options);
      }
});
