import React from "react"
import Chart from 'react-apexcharts'
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from "@material-ui/core";

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
  let parcelaDevedor = (valorImovel-entrada)/tempo
  let saldoDevedor = valorImovel-entrada-parcelaDevedor
  let encargos = saldoDevedor*sfh
  let inv = disponivel-itbi*valorImovel-encargos-parcelaDevedor
  for (let t = 1; t <= tempo-1; t++) {
    disponivel = disponivel*(1+inflacao)
    saldoDevedor = saldoDevedor - parcelaDevedor
    encargos = saldoDevedor*sfh
    inv = inv*(1+selic*0.85)+disponivel - encargos - parcelaDevedor
  }
  vi = valorImovel*Math.pow(1+valorizacao, tempo-1)
  return ((vi+inv-saldoDevedor)/Math.pow((1+inflacao),tempo-1)).toFixed(2)
}

const calculateAluguel = (valorImovel, valorAluguel, inflacao, selic, valorizacao, tempo, investimento, entrada) => {
  let inv1 = entrada
  let aluguel = valorAluguel*12
  let disponivel = investimento*12
  let inv2 = disponivel-aluguel
  for (let t = 1; t <= tempo-1; t++) {
    disponivel = disponivel*(1+inflacao)
    aluguel = aluguel*(1+valorizacao)
    inv2 = inv2*(1+selic*0.85)+disponivel-aluguel
  }
  inv1 = entrada*Math.pow(1+selic*0.85, tempo-1)
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
  const resultadoAluguel = calculateAluguel(valorImovel, valorAluguel, inflacao, selic, valorizacao, tempo, investimento, entrada)

  let inflacaoData = [[],[],[]]
  let jurosData = [[],[],[]]
  let valorizacaoData = [[],[],[]]
  let valorAluguelData = [[],[],[]]
  let entradaData = [[],[],[]]
  let sfhData = [[],[],[]]
  
  for (let i=0;i<10;i++) {
    inflacaoData[0].push(calculateCompra(valorImovel, inflacao, i/100, valorizacao, tempo, investimento, itbi, entrada, sfh))
    inflacaoData[1].push(calculateAluguel(valorImovel, valorAluguel, inflacao, i/100, valorizacao, tempo, investimento, entrada))
    inflacaoData[2].push(i+'%')

    jurosData[0].push(calculateCompra(valorImovel, i/100, selic, valorizacao, tempo, investimento, itbi, entrada, sfh))
    jurosData[1].push(calculateAluguel(valorImovel, valorAluguel, i/100, selic, valorizacao, tempo, investimento, entrada))
    jurosData[2].push(i+'%')

    valorizacaoData[0].push(calculateCompra(valorImovel, inflacao, selic, i/100, tempo, investimento, itbi, entrada, sfh))
    valorizacaoData[1].push(calculateAluguel(valorImovel, valorAluguel, inflacao, selic, i/100, tempo, investimento, entrada))
    valorizacaoData[2].push(i+'%')

    valorAluguelData[0].push(calculateCompra(valorImovel, inflacao, selic, valorizacao, tempo, investimento, itbi, entrada, sfh))
    valorAluguelData[1].push(calculateAluguel(valorImovel, -400+100*i+valorAluguel, inflacao, selic, valorizacao, tempo, investimento, entrada))
    valorAluguelData[2].push(-400+100*i+valorAluguel)

    entradaData[0].push(calculateCompra(valorImovel, inflacao, selic, valorizacao, tempo, investimento, itbi, i*valorImovel/10, sfh))
    entradaData[1].push(calculateAluguel(valorImovel, valorAluguel, inflacao, selic, valorizacao, tempo, investimento, i*valorImovel/10))
    entradaData[2].push(i*valorImovel/10)

    sfhData[0].push(calculateCompra(valorImovel, inflacao, selic, valorizacao, tempo, investimento, itbi, entrada, i/100))
    sfhData[1].push(calculateAluguel(valorImovel, valorAluguel, inflacao, selic, valorizacao, tempo, investimento, entrada))
    sfhData[2].push(i+'%')

  }

  const jurosSeries = generateOptions("Juros", "Compra", "Aluguel", "Juros (%)", jurosData[0], jurosData[1], jurosData[2])
  const inflacaoSeries = generateOptions("Inflação", "Compra", "Aluguel", "Inflação (%)", inflacaoData[0], inflacaoData[1], inflacaoData[2])
  const valorizacaoSeries = generateOptions("Valorização/Depreciação", "Compra", "Aluguel", "Valorização/Depreciação (%)", valorizacaoData[0], valorizacaoData[1], valorizacaoData[2])
  const valorAluguelSeries = generateOptions("Valor aluguel", "Compra", "Aluguel", "Valor aluguel (R$)", valorAluguelData[0], valorAluguelData[1], valorAluguelData[2])
  const entradaSeries = generateOptions("Entrada", "Compra", "Aluguel", "Entrada (R$)", entradaData[0], entradaData[1], entradaData[2])
  const sfhSeries = generateOptions("Taxa Financiamento", "Compra", "Aluguel", "Taxa Financiamento (%)", sfhData[0], sfhData[1], sfhData[2])

  return (
    <div className={classes.resultContainer}>
      <div className={classes.row}>
        <Typography> Se você der uma entrada de {entrada} reais no imóvel, pagar o financiamento, e investir o restante da renda disponível, ao final de {tempo} anos você terá um patrimônio de <b>{resultadoCompra}</b> reais </Typography>
        <Typography> Se você investir {entrada} reais, pagar um aluguel de {valorAluguel} reais mensais, e investir o restante da renda disponível, ao final de {tempo} anos você terá um patrimônio de <b>{resultadoAluguel}</b> reais </Typography>
      </div>
      <div className={classes.row} >
        <div id="chart">
          <Chart
            options={jurosSeries.options}
            series={jurosSeries.series}
            type="line"
            width="450"
          />
        </div>
        <div id="chart">
          <Chart
            options={inflacaoSeries.options}
            series={inflacaoSeries.series}
            type="line"
            width="450"
          />
        </div>
        <div id="chart">
          <Chart
            options={valorizacaoSeries.options}
            series={valorizacaoSeries.series}
            type="line"
            width="450"
          />
        </div>
        <div id="chart">
          <Chart
            options={valorAluguelSeries.options}
            series={valorAluguelSeries.series}
            type="line"
            width="450"
          />
        </div>
        <div id="chart">
          <Chart
            options={entradaSeries.options}
            series={entradaSeries.series}
            type="line"
            width="450"
          />
        </div>
        <div id="chart">
          <Chart
            options={sfhSeries.options}
            series={sfhSeries.series}
            type="line"
            width="450"
          />
        </div>
      </div>
    </div>
  );
}

export default Results;
