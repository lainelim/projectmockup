var dataSet = [
  [28, 42156],   [29, 85562],  [30, 130257],  [31, 176278],  [32, 223663],  [33, 272455],
  [34, 322693],  [35, 374422],  [36, 427686],  [37, 482529],  [38, 538998], [39, 597143],
  [40, 657012], [41,718656]
]

document.getElementById("networthCal").addEventListener("click", function() {


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
        colors: ['#EF851C']
      };

      var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
      chart.draw(data, options);
    }
});
