// helper functions

//function that returns the annual salary at nth year (years === nth)
function myAnnualSalary (years) {
  let monthlySalary = +$('#monthlySalary').value,
    annualIncrement = +$('#annualIncrement').value / 100
  let annualSalary

  annualSalary = (monthlySalary * 12) * Math.pow(1 + annualIncrement, years)

  return annualSalary
}
// cpf contribution at nth year
function myCPFContribution (years) {
  // annual CPF contribution by employee
  return myAnnualSalary(years) * 0.2
}

//disposableincome at nth year
function myDisposableIncome (years) {
  // after expenditure
  let expenditure = +$('#expenditure').value

  return (myAnnualSalary(years) - myCPFContribution(years)) * (1 - expenditure)
}

function employerCPFContribution (years) {
  // default 16% employer's contribution
  return myAnnualSalary(years) * 0.16
}

// calculator
function myBankSavings (years) {
  let percentageSaved = +$('#savings').value,
      savingsRate = +$('savingsRate').value

  if (years === 0) {
    return myDisposableIncome(years) * percentageSaved * (1+savingsRate)
  } else {
    return (myBankSavings(years - 1) + (myDisposableIncome(years) * percentageSaved))* (1+savingsRate)
  }
}

function myCPFSavings (years) {
  let cpfRate = +$('#cpfRate').value

  if (years === 0) {
    return (myCPFContribution(years) + employerCPFContribution(years)) * (1+cpfRate)
  } else {
    return (myCPFSavings(years - 1) + (myCPFContribution(years) + employerCPFContribution(years))) * (1+cpfRate)
  }
}

function myCashSavings (years) {
  let cashRate = +$('#cashRate').value
      percentageCash = 1 - $('#savings')

  if (years === 0) {
    return myDisposableIncome(years)* percentageCash * (1+cashRate)
  } else {
    return (myCashSavings(years - 1) + (myDisposableIncome(years)*percentageCash)) * (1+cashRate)
  }
}

function myTotalNetworth () {

  function mySavingsArray () {
    // returns an array of the cumulative savings (bank) generated each year

    let numWorkingYears = retireAge - startAge,
    numRetirementYears = deathAge - retireAge,
    savingsRate = +$('#savingsRate').value,
    bankSavingsPerYear = []

    for (var numYears = 0; numYears <= numWorkingYears; i++) {
      bankSavingsPerYear.push(myBankSavings(numYears))
    }

    for (var n = 1; n <= numRetirementYears; n++) {
      bankSavingsPerYear.push(bankSavingsPerYear[bankSavingsPerYear.length-1]*Math.pow(1+savingsRate, n))
    }

    return bankSavingsPerYear
  }

  function myCPFArray () {

    let numWorkingYears = retireAge - startAge,
    numRetirementYears = deathAge - retireAge,
    cpfRate = +$('#cpfRate').value,
    cpfSavingsPerYear = []

    for (var numYears = 0; numYears <= numWorkingYears; i++) {
      cpfSavingsPerYear.push(myCPFSavings(numYears))
    }

    for (var n = 1; n <= numRetirementYears; n++) {
      cpfSavingsPerYear.push(cpfSavingsPerYear[cpfSavingsPerYear.length-1]*Math.pow(1+savingsRate, n))
    }

    return cpfSavingsPerYear
  }

  function myCashArray () {

    let numWorkingYears = retireAge - startAge,
    numRetirementYears = deathAge - retireAge,
    cashRate = +$('#cashRate').value,
    accumulatedCashPerYear = []

    for (var numYears = 0; numYears <= numWorkingYears; i++) {
      accumulatedCashPerYear.push(myCashSavings(numYears))
    }

    for (var n = 1; n <= numRetirementYears; n++) {
      accumulatedCashPerYear.push(accumulatedCashPerYear[accumulatedCashPerYear.length-1]*Math.pow(1+cashRate, n))
    }

    return accumulatedCashPerYear
  }

  let startAge = +$('#startAge').value,
      retireAge = +$('#retireAge').value,
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
