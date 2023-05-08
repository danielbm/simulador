import React from 'react'
import Chart from 'react-apexcharts'
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { Card } from "@material-ui/core";
import { formatNumber } from '../Helpers/Util.js'
import './ResultsComponentStyle.css';

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
      colors: ['#20B1DF', '#DF4E20'],
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth'
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
        },
        min: 0,
        forceNiceScale: true
      },
      legend: {
        position: 'top',
        horizontalAlign: 'right',
      },
      theme: {
        mode: 'light', 
        palette: 'palette2', 
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

const calculateResults = (valorImovel, valorAluguel, inflacao, selic, valorizacao, tempo, entrada, sfh, tempoInvest) => {
  valorizacao = (1+valorizacao)/(1+inflacao)-1
  sfh = (1+sfh)/(1+inflacao)-1
  selic = (1+selic)/(1+inflacao)-1

  let ir = 0.85
  let aluguel = valorAluguel*12
  let vi = valorImovel
  let parcelaDevedor = (valorImovel-entrada)/tempo
  let saldoDevedor = valorImovel-entrada
  let encargos = saldoDevedor*sfh
  let encargosAcumulado = encargos
  let inv = entrada*Math.pow((1+selic*ir), tempo)
  let invAluguel = 0
  let aluguelAcumulado = 0
  for (let t = 1; t <= tempoInvest; t++) {
    if (saldoDevedor > 0) {
      saldoDevedor = saldoDevedor - parcelaDevedor
      encargos = saldoDevedor*sfh
    } else {
      saldoDevedor = 0
      encargos = 0
      parcelaDevedor = 0
    }
    
    encargosAcumulado += encargos
    aluguel = aluguel*(1+valorizacao)
    // inv = inv*(1+selic*ir)-aluguel
    // inv += (parcelaDevedor+encargos)

    invAluguel = invAluguel - aluguel + parcelaDevedor+encargos
    if (invAluguel > 0) {
      invAluguel = invAluguel*(1+selic*ir)
    }
    aluguelAcumulado += aluguel
    // console.log('Saldo devedor:'+saldoDevedor+' Parcela:'+(parcelaDevedor+encargos)+' Invest:'+inv)
  }
  vi = valorImovel*Math.pow(1+valorizacao, tempoInvest-1)
  return {
    resultadoCompra: vi.toFixed(2),
    encargosAcumulado: encargosAcumulado,
    valorParcela: tempo > 0 ? (encargosAcumulado+valorImovel-entrada)/tempo/12 : 0,
    resultadoAluguel: (inv+invAluguel).toFixed(2),
    aluguelAcumulado: aluguelAcumulado,
    desvalorização: (vi-valorImovel).toFixed(2),
    investimentoEntrada: (inv).toFixed(2),
  }
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

  let { valorImovel, valorAluguel, inflacao, selic, valorizacao, tempo, entrada, sfh } = props.values
  valorImovel = Number(valorImovel)
  valorAluguel = Number(valorAluguel)
  inflacao = Number(inflacao)/100
  selic = Number(selic)/100
  valorizacao = Number(valorizacao)/100
  tempo = Number(tempo)
  entrada = Number(entrada)
  sfh = Number(sfh)/100
  let tempoInvest = tempo
  // console.log(valorImovel, valorAluguel, inflacao, selic, valorizacao, tempo, investimento)

  const { resultadoCompra, encargosAcumulado, valorParcela, resultadoAluguel, aluguelAcumulado, desvalorização, investimentoEntrada } = calculateResults(valorImovel, valorAluguel, inflacao, selic, valorizacao, tempo,  entrada, sfh, tempoInvest)

  let inflacaoData = [[],[],[]]
  let jurosData = [[],[],[]]
  let valorizacaoData = [[],[],[]]
  let valorAluguelData = [[],[],[]]
  let entradaData = [[],[],[]]
  let sfhData = [[],[],[]]

  let results = {}
  for (let i=0;i<10;i++) {
    results = calculateResults(valorImovel, valorAluguel, inflacao, i/100+0.04, valorizacao, tempo,  entrada, sfh, tempoInvest)
    jurosData[0].push(results.resultadoCompra)
    jurosData[1].push(results.resultadoAluguel)
    jurosData[2].push(i+4+'%')

    results = calculateResults(valorImovel, valorAluguel, i/100, selic, valorizacao, tempo,  entrada, sfh, tempoInvest)
    inflacaoData[0].push(results.resultadoCompra)
    inflacaoData[1].push(results.resultadoAluguel)
    inflacaoData[2].push(i+'%')

    results = calculateResults(valorImovel, valorAluguel, inflacao, selic, i/100, tempo,  entrada, sfh, tempoInvest)
    valorizacaoData[0].push(results.resultadoCompra)
    valorizacaoData[1].push(results.resultadoAluguel)
    valorizacaoData[2].push(i+'%')

    results = calculateResults(valorImovel, -400+100*i+valorAluguel, inflacao, selic, valorizacao, tempo,  entrada, sfh, tempoInvest)
    valorAluguelData[0].push(results.resultadoCompra)
    valorAluguelData[1].push(results.resultadoAluguel)
    valorAluguelData[2].push(-400+100*i+valorAluguel)

    results = calculateResults(valorImovel, valorAluguel, inflacao, selic, valorizacao, tempo,  i*valorImovel/10, sfh, tempoInvest)
    entradaData[0].push(results.resultadoCompra)
    entradaData[1].push(results.resultadoAluguel)
    entradaData[2].push(i*valorImovel/10)

    results = calculateResults(valorImovel, valorAluguel, inflacao, selic, valorizacao, tempo,  entrada, i/100+0.04, tempoInvest)
    sfhData[0].push(results.resultadoCompra)
    sfhData[1].push(results.resultadoAluguel)
    sfhData[2].push(i+4+'%')
  }

  const jurosSeries = generateOptions("SELIC", "Compra", "Aluguel", "Juros (%)", jurosData[0], jurosData[1], jurosData[2], false)
  const inflacaoSeries = generateOptions("Inflação", "Compra", "Aluguel", "Inflação (%)", inflacaoData[0], inflacaoData[1], inflacaoData[2], false)
  const valorizacaoSeries = generateOptions("Valorização/Depreciação", "Compra", "Aluguel", "Valorização/Depreciação (%)", valorizacaoData[0], valorizacaoData[1], valorizacaoData[2], false)
  const valorAluguelSeries = generateOptions("Valor aluguel", "Compra", "Aluguel", "Valor aluguel (R$)", valorAluguelData[0], valorAluguelData[1], valorAluguelData[2], false)
  const entradaSeries = generateOptions("Entrada", "Compra", "Aluguel", "Entrada (R$)", entradaData[0], entradaData[1], entradaData[2], false)
  const sfhSeries = generateOptions("Juros Financiamento", "Compra", "Aluguel", "Taxa Financiamento (%)", sfhData[0], sfhData[1], sfhData[2], false)

  return (
    <div>
      <Card>
        <div className="summaryContainer">
          <p>
            Nestas condições de financiamento, para adquirir este imóvel em {tempo} anos, é necessário 
            investir <span className='red'>{formatNumber(encargosAcumulado+valorImovel, 'currency')}</span>, ou <span className='red'>{formatNumber(valorParcela, 'currency')}</span> por 
            mês. Ao final de {tempoInvest} anos 
            seu patrimônio total seria de <span className='green'>{formatNumber(resultadoCompra, 'currency')}</span>, tendo em vista a valorização 
            de <span className='red'>{formatNumber(desvalorização, 'currency')}</span> do imóvel, considerando a inflação.
          </p>
          <p>
            Se o mesmo imóvel fosse alugado por <span className='red'>{formatNumber(valorAluguel, 'currency')}</span>, 
            o investimento da entrada teria rendido <span className='green'>{formatNumber(investimentoEntrada, 'currency')}</span>, a 
            diferença entre a parcela e o aluguel teria rendido <span className='green'>{formatNumber(resultadoAluguel-investimentoEntrada, 'currency')}</span>, e 
            ao final de {tempoInvest} anos, seu patrimônio total seria de <span className='green'>{formatNumber(resultadoAluguel, 'currency')}</span>.
          </p>
        </div>
        </Card>
        <Card>
        <div className='summaryContainer'>
          <div className={isMobile ? "panelMobile" : "panel"} >
            <h3 className='compra'>
              Compra
            </h3>
            <p className="despesa"> Despesas </p>
            <p className="gastos">
              Entrada: {formatNumber(entrada, 'currency')} <br />
              Financiamento: {formatNumber(valorImovel-entrada, 'currency')} <br />
              Juros: {formatNumber(encargosAcumulado, 'currency')} <br />
              Parcela média do financiamento: {formatNumber(valorParcela, 'currency')} <br />
            </p>
            <p className="despesa"> Patrimônio após {tempoInvest} anos </p>
            <p className="gastos">
              Imóvel: {formatNumber(resultadoCompra, 'currency')} <br />
            </p>
            </div>
            <div className={isMobile ? "panelMobile" : "panel"} >
            <h3 className='aluguel'>
              Aluguel
            </h3>
            <p className="despesa"> Despesas </p>
            <p className="gastos">
              Aluguel: {formatNumber(aluguelAcumulado, 'currency')} <br />
              Valor médio do aluguel: {formatNumber(aluguelAcumulado/tempoInvest/12, 'currency')} ({formatNumber(aluguelAcumulado*100/tempoInvest/valorImovel, 'percentage')})<br />
              Investimento inicial: {formatNumber(entrada, 'currency')} <br />
              Investimento adicional mensal: {formatNumber(valorParcela-aluguelAcumulado/tempoInvest/12, 'currency')}

            </p>
            <p className="despesa"> Patrimônio após {tempoInvest} anos </p>
            <p className="gastos">
              Investimentos: {formatNumber(resultadoAluguel, 'currency')} <br />
            </p>
          </div>
        </div>
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
