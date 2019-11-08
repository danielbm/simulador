import React from "react"
import Chart from 'react-apexcharts'
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  row: {
    display: "flex",
    justifyContent: "space-around",
    flexWrap: "wrap"
  },
}));

const calculateCompra = (valorImovel, inflacao, selic, valorizacao, tempo, investimento, itbi, entrada, sfh) => {
  let vi = valorImovel
  let disponivel = investimento*12
  let inv = disponivel-itbi*valorImovel
  // let devedor = valorImovel-entrada
  for (let t = 1; t <= tempo-1; t++) {
    disponivel = disponivel*(1+inflacao)
    inv = inv*(1+selic*0.85)+disponivel
  }
  vi = valorImovel*Math.pow(1+valorizacao, tempo-1)
  return ((vi+inv)/Math.pow((1+inflacao),tempo-1)).toFixed(2)
}

const calculateAluguel = (valorImovel, valorAluguel, inflacao, selic, valorizacao, tempo, investimento) => {
  let inv1 = valorImovel
  let aluguel = valorAluguel*12
  let disponivel = investimento*12
  let inv2 = disponivel-aluguel
  for (let t = 1; t <= tempo-1; t++) {
    disponivel = disponivel*(1+inflacao)
    aluguel = aluguel*(1+valorizacao)
    inv2 = inv2*(1+selic*0.85)+disponivel-aluguel
  }
  inv1 = valorImovel*Math.pow(1+selic*0.85, tempo-1)
  return ((inv1+inv2)/Math.pow((1+inflacao),tempo-1)).toFixed(2)
}

const generateOptions = (title, line1, line2, xname, data1, data2, categories) => {
  let options = {
    options: {
      chart: {
        shadow: {
          enabled: true,
          color: '#000',
          top: 18,
          left: 7,
          blur: 10,
          opacity: 1
        },
        toolbar: {
          show: false
        }
      },
      colors: ['#77B6EA', '#545454'],
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth'
      },
      grid: {
        borderColor: '#e7e7e7',
        row: {
          colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
          opacity: 0.5
        },
      },
      markers: {
        size: 6
      },
      title: {
        text: title,
        align: 'left'
      },
      xaxis: {
        categories: categories,
        title: {
          text: xname
        }
      },
      yaxis: {
        title: {
          text: 'Patrimônio'
        },
      },
      legend: {
        position: 'top',
        horizontalAlign: 'right',
        floating: true,
        offsetY: -25,
        offsetX: -5
      }
    },
    series: [
      {
        name: line1,
        data: data1
      },
      {
        name: line2,
        data: data2
      }
    ]
  }
  
  return options
}

function Results(props) {
  const classes = useStyles();

  let { valorImovel, valorAluguel, inflacao, selic, valorizacao, tempo, investimento, itbi, entrada, sfh } = props.values
  valorImovel = Number(valorImovel)
  valorAluguel = Number(valorAluguel)
  inflacao = Number(inflacao)
  selic = Number(selic)
  valorizacao = Number(valorizacao)
  tempo = Number(tempo)
  investimento = Number(investimento)
  itbi = Number(itbi)

  // console.log(valorImovel, valorAluguel, inflacao, selic, valorizacao, tempo, investimento)

  const resultadoCompra = calculateCompra(valorImovel, inflacao, selic, valorizacao, tempo, investimento, itbi, entrada, sfh)
  const resultadoAluguel = calculateAluguel(valorImovel, valorAluguel, inflacao, selic, valorizacao, tempo, investimento)

  let inflacaoData = [[],[],[]]
  let jurosData = [[],[],[]]
  let valorizacaoData = [[],[],[]]
  let valorAluguelData = [[],[],[]]
  
  for (let i=0;i<10;i++) {
    inflacaoData[0].push(calculateCompra(valorImovel, inflacao, i/100, valorizacao, tempo, investimento, itbi, entrada, sfh))
    inflacaoData[1].push(calculateAluguel(valorImovel, valorAluguel, inflacao, i/100, valorizacao, tempo, investimento))
    inflacaoData[2].push(i+'%')

    jurosData[0].push(calculateCompra(valorImovel, i/100, selic, valorizacao, tempo, investimento, itbi, entrada, sfh))
    jurosData[1].push(calculateAluguel(valorImovel, valorAluguel, i/100, selic, valorizacao, tempo, investimento))
    jurosData[2].push(i+'%')

    valorizacaoData[0].push(calculateCompra(valorImovel, inflacao, selic, i/100, tempo, investimento, itbi, entrada, sfh))
    valorizacaoData[1].push(calculateAluguel(valorImovel, valorAluguel, inflacao, selic, i/100, tempo, investimento))
    valorizacaoData[2].push(i+'%')

    valorAluguelData[0].push(calculateCompra(valorImovel, inflacao, selic, valorizacao, tempo, investimento, itbi, entrada, sfh))
    valorAluguelData[1].push(calculateAluguel(valorImovel, -400+100*i+valorAluguel, inflacao, selic, valorizacao, tempo, investimento))
    valorAluguelData[2].push(-400+100*i+valorAluguel)

  }

  const jurosSeries = generateOptions("Juros", "Compra", "Aluguel", "Juros (%)", jurosData[0], jurosData[1], jurosData[2])
  const inflacaoSeries = generateOptions("Inflação", "Compra", "Aluguel", "Inflação (%)", inflacaoData[0], inflacaoData[1], inflacaoData[2])
  const valorizacaoSeries = generateOptions("Valorização/Depreciação", "Compra", "Aluguel", "Valorização/Depreciação (%)", valorizacaoData[0], valorizacaoData[1], valorizacaoData[2])
  const valorAluguelSeries = generateOptions("Valor aluguel", "Compra", "Aluguel", "Valor aluguel (R$)", valorAluguelData[0], valorAluguelData[1], valorAluguelData[2])

  return (
    <div className={classes.resultContainer}>
      <div className={classes.row}>
        <h1> Resultado compra: {resultadoCompra} </h1>
        <h1> Resultado aluguel: {resultadoAluguel} </h1>
      </div>
      <div className={classes.row} >
        <div id="chart">
          <Chart
            options={jurosSeries.options}
            series={jurosSeries.series}
            type="line"
            width="480"
          />
        </div>
        <div id="chart">
          <Chart
            options={inflacaoSeries.options}
            series={inflacaoSeries.series}
            type="line"
            width="480"
          />
        </div>
        <div id="chart">
          <Chart
            options={valorizacaoSeries.options}
            series={valorizacaoSeries.series}
            type="line"
            width="480"
          />
        </div>
        <div id="chart">
          <Chart
            options={valorAluguelSeries.options}
            series={valorAluguelSeries.series}
            type="line"
            width="480"
          />
        </div>
      </div>
    </div>
  );
}

export default Results;
