import React from 'react'
import Chart from 'react-apexcharts'
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { Card, CardContent } from "@material-ui/core";
import { formatNumber, truncate } from '../Helpers/Util.js'
import './ResultsComponentStyle.css';


const igualaAluguel = (resultadoCompra, entrada, aluguelAcumulado, selic, inflacao, tempo) => {
  // selic = (1+selic)/(1+inflacao)-1
  //
  // parcela =
  // fv = -entrada*Math.pow(1+selic*0.85,tempo)
  // fv += resultadoCompra

}
const calculateCompra = (valorImovel, inflacao, selic, valorizacao, tempo, investimento,  entrada, sfh) => {
  // tempo = tempo*12
  // inflacao = Math.pow(1+inflacao,1/12)-1
  // selic =  Math.pow(1+selic,1/12)-1
  // valorizacao =  Math.pow(1+valorizacao,1/12)-1
  // sfh =  Math.pow(1+sfh,1/12)-1
  valorizacao = (1+valorizacao)/(1+inflacao)-1
  sfh = (1+sfh)/(1+inflacao)-1

  let vi = valorImovel
  let parcelaDevedor = (valorImovel-entrada)/tempo
  let saldoDevedor = valorImovel-entrada-parcelaDevedor
  let encargos = saldoDevedor*sfh
  let encargosAcumulado = encargos
  for (let t = 1; t <= tempo-1; t++) {
    saldoDevedor = saldoDevedor - parcelaDevedor
    encargos = saldoDevedor*sfh
    encargosAcumulado += encargos
  }
  vi = valorImovel*Math.pow(1+valorizacao, tempo-1)
  return {
    resultadoCompra: vi.toFixed(2),
    encargosAcumulado: encargosAcumulado,
    valorParcela: encargosAcumulado/tempo+(valorImovel-entrada)/tempo
  }
}

const calculateAluguel = (valorImovel, valorAluguel, inflacao, selic, valorizacao, tempo, investimento, entrada, sfh) => {
  // tempo = tempo*12
  // inflacao = Math.pow(1+inflacao,1/12)-1
  // selic =  Math.pow(1+selic,1/12)-1
  // valorizacao =  Math.pow(1+valorizacao,1/12)-1
  // sfh =  Math.pow(1+sfh,1/12)-1
  // valorAluguel = valorAluguel/12
  selic = (1+selic)/(1+inflacao)-1
  valorizacao = (1+valorizacao)/(1+inflacao)-1
  sfh = (1+sfh)/(1+inflacao)-1

  let ir = 0.85
  let aluguel = valorAluguel*12
  let parcelaDevedor = (valorImovel-entrada)/tempo
  let saldoDevedor = valorImovel-entrada-parcelaDevedor
  let encargos = saldoDevedor*sfh
  let inv = entrada*(1+selic*ir)-aluguel+parcelaDevedor+encargos
  let inv2 = 0
  let aluguelAcumulado = aluguel
  for (let t = 1; t <= tempo-1; t++) {
    saldoDevedor = saldoDevedor - parcelaDevedor
    encargos = saldoDevedor*sfh
    aluguel = aluguel*(1+valorizacao)
    inv = inv*(1+selic*ir)-aluguel+parcelaDevedor+encargos
    inv2 = inv2*(1+selic*ir)
    aluguelAcumulado += aluguel
  }
  return {
    resultadoAluguel: (inv+inv2).toFixed(2),
    aluguelAcumulado: aluguelAcumulado,
    resultadoInvEntrada: inv.toFixed(2),
    resultadoInvSaldo: inv2.toFixed(2)
  }
}
//
// const calculateCompra = (valorImovel, inflacao, selic, valorizacao, tempo, investimento,  entrada, sfh) => {
//   // tempo = tempo*12
//   // inflacao = Math.pow(1+inflacao,1/12)-1
//   // selic =  Math.pow(1+selic,1/12)-1
//   // valorizacao =  Math.pow(1+valorizacao,1/12)-1
//   // sfh =  Math.pow(1+sfh,1/12)-1
//
//   let vi = valorImovel
//   let parcelaDevedor = (valorImovel-entrada)/tempo
//   let saldoDevedor = valorImovel-entrada-parcelaDevedor
//   let encargos = saldoDevedor*sfh
//   let encargosAcumulado = encargos
//   for (let t = 1; t <= tempo-1; t++) {
//     saldoDevedor = saldoDevedor - parcelaDevedor
//     encargos = saldoDevedor*sfh
//     encargosAcumulado += encargos/Math.pow((1+inflacao),t)
//   }
//   vi = valorImovel*Math.pow(1+valorizacao, tempo-1)
//   return {
//     resultadoCompra: ((vi)/Math.pow((1+inflacao),tempo-1)).toFixed(2),
//     encargosAcumulado: encargosAcumulado,
//     valorParcela: encargosAcumulado/tempo+(valorImovel-entrada)/tempo
//   }
// }
//
// const calculateAluguel = (valorImovel, valorAluguel, inflacao, selic, valorizacao, tempo, investimento, entrada, sfh) => {
//   // tempo = tempo*12
//   // inflacao = Math.pow(1+inflacao,1/12)-1
//   // selic =  Math.pow(1+selic,1/12)-1
//   // valorizacao =  Math.pow(1+valorizacao,1/12)-1
//   // sfh =  Math.pow(1+sfh,1/12)-1
//   // valorAluguel = valorAluguel/12
//
//   let ir = 0.85
//   let aluguel = valorAluguel*12
//   let parcelaDevedor = (valorImovel-entrada)/tempo
//   let saldoDevedor = valorImovel-entrada-parcelaDevedor
//   let encargos = saldoDevedor*sfh
//   let inv = entrada*(1+selic*ir)-aluguel+parcelaDevedor+encargos
//   let inv2 = 0
//   let aluguelAcumulado = aluguel
//   for (let t = 1; t <= tempo-1; t++) {
//     saldoDevedor = saldoDevedor - parcelaDevedor
//     encargos = saldoDevedor*sfh
//     aluguel = aluguel*(1+valorizacao)
//     inv = inv*(1+selic*ir)-aluguel+parcelaDevedor+encargos
//     inv2 = inv2*(1+selic*ir)
//     aluguelAcumulado += aluguel/Math.pow((1+inflacao),t)
//   }
//   return {
//     resultadoAluguel: ((inv+inv2)/Math.pow((1+inflacao),tempo-1)).toFixed(2),
//     aluguelAcumulado: aluguelAcumulado,
//     resultadoInvEntrada: (inv/Math.pow((1+inflacao),tempo-1)).toFixed(2),
//     resultadoInvSaldo: (inv2/Math.pow((1+inflacao),tempo-1)).toFixed(2)
//   }
// }

const generateOptions = (title, line1, line2, xname, data1, data2, categories, rotate) => {
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
          show: true
        }
      },
      tooltip: {
        followCursor: true,
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
        size: 0
      },
      title: {
        text: title,
        align: 'left'
      },
      xaxis: {
        categories: categories,
        labels: {
          // rotate: -45,
          // rotateAlways: rotate,
          hideOverlappingLabels: true,
        },
        title: {
          text: xname
        },

      },
      yaxis: {
        title: {
          text: 'Patrimônio'
        },
        labels: {
          formatter: (value) => { return formatNumber(value, "currency").slice(0,-3) },
        }
      },
      legend: {
        position: 'top',
        horizontalAlign: 'right',
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

const generateChart = (series, isMobile) => {
  return (
    <Chart
      options={series.options}
      series={series.series}
      type="line"
      className={isMobile ? "chartMobile" : "chart"}
    />
  )
}

function ResultsComponent(props) {
  const isMobile = useMediaQuery('(max-width:600px)');

  let { valorImovel, valorAluguel, inflacao, selic, valorizacao, tempo, investimento, entrada, sfh } = props.values
  valorImovel = Number(valorImovel)
  valorAluguel = Number(valorAluguel)
  inflacao = Number(inflacao)/100
  selic = Number(selic)/100
  valorizacao = Number(valorizacao)/100
  tempo = Number(tempo)
  investimento = Number(investimento)
  entrada = Number(entrada)
  sfh = Number(sfh)/100
  // console.log(valorImovel, valorAluguel, inflacao, selic, valorizacao, tempo, investimento)

  const { resultadoCompra, encargosAcumulado, valorParcela } = calculateCompra(valorImovel, inflacao, selic, valorizacao, tempo, investimento,  entrada, sfh)
  const { resultadoAluguel, aluguelAcumulado, resultadoInvEntrada, resultadoInvSaldo } = calculateAluguel(valorImovel, valorAluguel, inflacao, selic, valorizacao, tempo, investimento, entrada, sfh)

  let inflacaoData = [[],[],[]]
  let jurosData = [[],[],[]]
  let valorizacaoData = [[],[],[]]
  let valorAluguelData = [[],[],[]]
  let entradaData = [[],[],[]]
  let sfhData = [[],[],[]]

  for (let i=0;i<10;i++) {
    jurosData[0].push(calculateCompra(valorImovel, inflacao, i/100+0.04, valorizacao, tempo, investimento,  entrada, sfh).resultadoCompra)
    jurosData[1].push(calculateAluguel(valorImovel, valorAluguel, inflacao, i/100+0.04, valorizacao, tempo, investimento, entrada, sfh).resultadoAluguel)
    jurosData[2].push(i+4+'%')

    inflacaoData[0].push(calculateCompra(valorImovel, i/100, selic, valorizacao, tempo, investimento,  entrada, sfh).resultadoCompra)
    inflacaoData[1].push(calculateAluguel(valorImovel, valorAluguel, i/100, selic, valorizacao, tempo, investimento, entrada, sfh).resultadoAluguel)
    inflacaoData[2].push(i+'%')

    valorizacaoData[0].push(calculateCompra(valorImovel, inflacao, selic, i/100, tempo, investimento,  entrada, sfh).resultadoCompra)
    valorizacaoData[1].push(calculateAluguel(valorImovel, valorAluguel, inflacao, selic, i/100, tempo, investimento, entrada, sfh).resultadoAluguel)
    valorizacaoData[2].push(i+'%')

    valorAluguelData[0].push(calculateCompra(valorImovel, inflacao, selic, valorizacao, tempo, investimento,  entrada, sfh).resultadoCompra)
    valorAluguelData[1].push(calculateAluguel(valorImovel, -400+100*i+valorAluguel, inflacao, selic, valorizacao, tempo, investimento, entrada, sfh).resultadoAluguel)
    valorAluguelData[2].push(-400+100*i+valorAluguel)

    entradaData[0].push(calculateCompra(valorImovel, inflacao, selic, valorizacao, tempo, investimento,  i*valorImovel/10, sfh).resultadoCompra)
    entradaData[1].push(calculateAluguel(valorImovel, valorAluguel, inflacao, selic, valorizacao, tempo, investimento, i*valorImovel/10, sfh).resultadoAluguel)
    entradaData[2].push(i*valorImovel/10)

    sfhData[0].push(calculateCompra(valorImovel, inflacao, selic, valorizacao, tempo, investimento,  entrada, i/100+0.04).resultadoCompra)
    sfhData[1].push(calculateAluguel(valorImovel, valorAluguel, inflacao, selic, valorizacao, tempo, investimento, entrada, i/100+0.04).resultadoAluguel)
    sfhData[2].push(i+4+'%')
  }

  const jurosSeries = generateOptions("Juros", "Compra", "Aluguel", "Juros (%)", jurosData[0], jurosData[1], jurosData[2], false)
  const inflacaoSeries = generateOptions("Inflação", "Compra", "Aluguel", "Inflação (%)", inflacaoData[0], inflacaoData[1], inflacaoData[2], false)
  const valorizacaoSeries = generateOptions("Valorização/Depreciação", "Compra", "Aluguel", "Valorização/Depreciação (%)", valorizacaoData[0], valorizacaoData[1], valorizacaoData[2], false)
  const valorAluguelSeries = generateOptions("Valor aluguel", "Compra", "Aluguel", "Valor aluguel (R$)", valorAluguelData[0], valorAluguelData[1], valorAluguelData[2], false)
  const entradaSeries = generateOptions("Entrada", "Compra", "Aluguel", "Entrada (R$)", entradaData[0], entradaData[1], entradaData[2], false)
  const sfhSeries = generateOptions("Taxa Financiamento", "Compra", "Aluguel", "Taxa Financiamento (%)", sfhData[0], sfhData[1], sfhData[2], false)

  return (
    <div>
      <Card>
        <CardContent>
          <div className={isMobile ? "panelMobile" : "panel"} >
          <p>
            Compra
          </p>
          <p className="despesa"> Despesas </p>
          <p className="gastos">
            Entrada: {formatNumber(entrada, 'currency')} <br />
            Financiamento: {formatNumber(valorImovel-entrada, 'currency')} <br />
            Juros: {formatNumber(encargosAcumulado, 'currency')} <br />
            Parcela do financiamento: {formatNumber(valorParcela, 'currency')} <br />
          </p>
          <p className="despesa"> Patrimônio </p>
          <p className="gastos">
            Imóvel: {formatNumber(resultadoCompra, 'currency')} <br />
          </p>
          </div>
          <div className={isMobile ? "panelMobile" : "panel"} >
          <p>
            Aluguel
          </p>
          <p className="despesa"> Despesas </p>
          <p className="gastos">
            Aluguel: {formatNumber(aluguelAcumulado, 'currency')} <br />
            Valor médio do aluguel: {formatNumber(aluguelAcumulado/tempo/12, 'currency')} ({formatNumber(aluguelAcumulado*100/tempo/valorImovel, 'percentage')})<br />

            Aluguel para igualar: {}
          </p>
          <p className="despesa"> Patrimônio </p>
          <p className="gastos">
            Investimento: {formatNumber(resultadoInvEntrada, 'currency')} <br />
          </p>

          </div>
        </CardContent>
      </Card>
      <Card>
        {generateChart(inflacaoSeries, isMobile)}
        {generateChart(valorizacaoSeries, isMobile)}
        {generateChart(jurosSeries, isMobile)}
        {generateChart(entradaSeries, isMobile)}
        {generateChart(valorAluguelSeries, isMobile)}
        {generateChart(sfhSeries, isMobile)}
      </Card>
    </div>
  );
}

export default ResultsComponent;
