let calculate = {

}

// helper functions
function myAnnualSalary (years) {
  let monthlySalary = +$('#monthlySalary').value,
    annualIncrement = +$('#annualIncrement').value / 100

  let annualSalary

  annualSalary = (monthlySalary * 12) * Math.pow(1 + annualIncrement, years)

  return annualSalary
}

function myCPFContribution (years) {
  // annual CPF contribution by employee
  return myAnnualSalary(years) * 0.2
}

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

  // !!!!!! logic needs refinement !!!!!
  if (years === 0) {
    return myDisposableIncome(years) * percentageSaved
  } else {
    return (myBankSavings(years - 1) + myDisposableIncome(years)) * percentageSaved
  }
}

function myEOYSavings () {
  // returns an array of the cumulative savings (bank) generated each year
  let startAge = +$('#startAge').value,
    retireAge = +$('#retireAge').value,
    deathAge = 100,
    numWorkingYears = retireAge - startAge,
    numRetirementYears = deathAge - retireAge,
    savingsRate = +$('savingsRate').value,
    bankSavingsPerYear = []

  for (var numYears = 0; numYears <= numWorkingYears; i++) {
    bankSavingsPerYear.push(myBankSavings(numYears))
  }

  for (var n = 1; n <= numRetirementYears; n++) {
    bankSavingsPerYear.push(bankSavingsPerYear[-1]*Math.pow(1+savingsRate, n))
  }

  return bankSavingsPerYear
}

function myEOYCPF () {

}

function myEOYCash () {

}

function myEOYNetworth () {

}
