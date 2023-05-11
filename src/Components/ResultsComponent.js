import React from 'react'
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { Card } from "@material-ui/core";
import { formatNumber } from '../Helpers/Util.js'
import './ResultsComponentStyle.css';
import ChartComponent from './ChartComponent'

const calculateResults = (valorImovel, valorAluguel, inflacao, selic, valorizacao, tempo, entrada, sfh, tempoInvest, isSelling) => {
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
  let inv = isSelling ? valorImovel*Math.pow((1+selic*ir), tempo) : entrada*Math.pow((1+selic*ir), tempo)
  let invSaldo = 0
  let aluguelAcumulado = 0
  let invAluguel = 0
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

    invSaldo = invSaldo - aluguel + parcelaDevedor+encargos
    invAluguel += aluguel
    invAluguel = invAluguel*(1+selic*ir)
    if (invSaldo > 0) {
      invSaldo = invSaldo*(1+selic*ir)
    }
    aluguelAcumulado += aluguel
    // console.log('Saldo devedor:'+saldoDevedor+' Parcela:'+(parcelaDevedor+encargos)+' Invest:'+inv)
  }
  vi = valorImovel*Math.pow(1+valorizacao, tempoInvest-1)
  return {
    resultadoCompra: isSelling ? inv : vi-valorImovel*0.04,
    encargosAcumulado: encargosAcumulado,
    valorParcela: tempo > 0 ? (encargosAcumulado+valorImovel-entrada)/tempo/12 : 0,
    resultadoAluguel: isSelling ? vi+invAluguel: (inv+invSaldo),
    aluguelAcumulado: aluguelAcumulado,
    desvalorizacao: (vi-valorImovel),
    investimentoEntrada: (inv),
    investimentoAluguel: (invAluguel),
    investimentoSaldo: invSaldo
  }
}

function ResultsComponent(props) {
  const isMobile = useMediaQuery('(max-width:600px)');

  let { valorImovel, valorAluguel, inflacao, selic, valorizacao, tempo, entrada, sfh, isMortgage, isSelling } = props.values
  valorImovel = Number(valorImovel)
  valorAluguel = Number(valorAluguel)
  inflacao = Number(inflacao)/100
  selic = Number(selic)/100
  valorizacao = Number(valorizacao)/100
  tempo = Number(tempo)
  entrada = !isMortgage && !isSelling ? Number(entrada) : Number(valorImovel)
  sfh = Number(sfh)/100
  let tempoInvest = tempo

  const strCompra = isSelling ? "Venda" : "Compra"
  const strAluguel = isSelling ? "Aluguel" : "Aluguel"

  const { resultadoCompra, encargosAcumulado, valorParcela, resultadoAluguel, aluguelAcumulado, desvalorizacao, investimentoEntrada, investimentoAluguel, investimentoSaldo } = calculateResults(valorImovel, valorAluguel, inflacao, selic, valorizacao, tempo,  entrada, sfh, tempoInvest, isSelling)

  let inflacaoData = [[],[],[]]
  let jurosData = [[],[],[]]
  let valorizacaoData = [[],[],[]]
  let valorAluguelData = [[],[],[]]
  let entradaData = [[],[],[]]
  let sfhData = [[],[],[]]

  let results = {}
  for (let i=0;i<10;i++) {
    results = calculateResults(valorImovel, valorAluguel, inflacao, i/100+0.04, valorizacao, tempo,  entrada, sfh, tempoInvest, isSelling)
    jurosData[0].push(results.resultadoCompra)
    jurosData[1].push(results.resultadoAluguel)
    jurosData[2].push(i+4+'%')

    results = calculateResults(valorImovel, valorAluguel, i/100, selic, valorizacao, tempo,  entrada, sfh, tempoInvest, isSelling)
    inflacaoData[0].push(results.resultadoCompra)
    inflacaoData[1].push(results.resultadoAluguel)
    inflacaoData[2].push(i+'%')

    results = calculateResults(valorImovel, valorAluguel, inflacao, selic, i/100, tempo,  entrada, sfh, tempoInvest, isSelling)
    valorizacaoData[0].push(results.resultadoCompra)
    valorizacaoData[1].push(results.resultadoAluguel)
    valorizacaoData[2].push(i+'%')

    results = calculateResults(valorImovel, -400+100*i+valorAluguel, inflacao, selic, valorizacao, tempo,  entrada, sfh, tempoInvest, isSelling)
    valorAluguelData[0].push(results.resultadoCompra)
    valorAluguelData[1].push(results.resultadoAluguel)
    valorAluguelData[2].push(-400+100*i+valorAluguel)

    results = calculateResults(valorImovel, valorAluguel, inflacao, selic, valorizacao, tempo,  i*valorImovel/10, sfh, tempoInvest, isSelling)
    entradaData[0].push(results.resultadoCompra)
    entradaData[1].push(results.resultadoAluguel)
    entradaData[2].push(i*valorImovel/10)

    results = calculateResults(valorImovel, valorAluguel, inflacao, selic, valorizacao, tempo,  entrada, i/100+0.04, tempoInvest, isSelling)
    sfhData[0].push(results.resultadoCompra)
    sfhData[1].push(results.resultadoAluguel)
    sfhData[2].push(i+4+'%')
  }

  return (
    <div>
      { !isSelling && (<Card>
        <div className="summaryContainer">
          <h2> A melhor opção é <span className={resultadoAluguel > resultadoCompra ? "aluguel" : "compra" }>{resultadoAluguel > resultadoCompra ? strAluguel.toLowerCase(): strCompra.toLowerCase()}</span></h2>
          {!isMortgage ? (<p>
            Nestas condições de financiamento, para adquirir este imóvel em {tempo} anos, é necessário 
            investir <span className='red'>{formatNumber(encargosAcumulado+valorImovel, 'currency')}</span>, ou <span className='red'>{formatNumber(valorParcela, 'currency')}</span> por 
            mês. Ao final de {tempoInvest} anos, tendo em vista a valorização de <span className='red'>{formatNumber(desvalorizacao, 'currency')}</span> do 
            imóvel, e considerando a inflação, seu patrimônio total seria de <span className='green'>{formatNumber(resultadoCompra, 'currency')}</span>.
          </p>)
          : (<p>
            Adquirindo o imóvel à vista por <span className='red'>{formatNumber(valorImovel, 'currency')}</span>, ao
            final de {tempoInvest} anos, tendo em vista a valorização de <span className='red'>{formatNumber(desvalorizacao, 'currency')}</span> do 
            imóvel, e considerando a inflação, seu patrimônio total seria de <span className='green'>{formatNumber(resultadoCompra, 'currency')}</span>.
          </p>)}
          {!isMortgage ? (<p>
            Se o mesmo imóvel fosse alugado por <span className='red'>{formatNumber(valorAluguel, 'currency')}</span>, 
            o investimento da entrada teria rendido <span className='green'>{formatNumber(investimentoEntrada, 'currency')}</span>, a 
            diferença entre a parcela e o aluguel teria rendido <span className='green'>{formatNumber(resultadoAluguel-investimentoEntrada, 'currency')}</span>, e 
            ao final de {tempoInvest} anos, seu patrimônio total seria de <span className='green'>{formatNumber(resultadoAluguel, 'currency')}</span>.
          </p>)
          : (<p>
            Se o mesmo imóvel fosse alugado por <span className='red'>{formatNumber(valorAluguel, 'currency')}</span>, 
            o investimento inicial teria rendido <span className='green'>{formatNumber(investimentoEntrada, 'currency')}</span>, o
            aluguel teria custado <span className='green'>{formatNumber(-(resultadoAluguel-investimentoEntrada), 'currency')}</span>, e 
            ao final de {tempoInvest} anos, seu patrimônio total seria de <span className='green'>{formatNumber(resultadoAluguel, 'currency')}</span>.
          </p>)}
        </div>
      </Card>) }
      { isSelling && (<Card>
        <div className='summaryContainer'>
          <h2> A melhor opção é <span className={resultadoAluguel > resultadoCompra ? "aluguel": "compra"}>{resultadoAluguel > resultadoCompra ? strAluguel.toLowerCase(): strCompra.toLowerCase()}</span></h2>
          <p> Se vendesse o imóvel por <span className='green'>{formatNumber(valorImovel, 'currency')}</span> e 
          investisse o valor, ao final de {tempoInvest} anos, seu patrimônio 
          seria de <span className='green'>{formatNumber(resultadoCompra, 'currency')}</span>. 
          </p>
          <p> Se colocasse o imóvel para locação por <span className='green'>{formatNumber(valorAluguel, 'currency')}</span>, tendo em 
          vista a valorização de <span className='red'>{formatNumber(desvalorizacao, 'currency')}</span> do imóvel, e o 
          investimento dos aluguéis mensais recebidos de <span className='green'>{formatNumber((investimentoAluguel), 'currency')}</span>, seu patrimônio total seria
          de <span className='green'>{formatNumber((resultadoAluguel), 'currency')}</span> .
          </p>
        </div>
      </Card>)}
      <Card>
        <div className='summaryContainer'>
          <div className={isMobile ? "panelMobile" : "panel"} >
            <h3 className='compra'>
              {strCompra}
            </h3>
            <p className="gastos">
              {!isSelling && !isMortgage && (<span>Entrada: {formatNumber(entrada, 'currency')} <br /></span>)}
              {!isSelling && isMortgage && (<span>Valor do imóvel: {formatNumber(valorImovel, 'currency')} <br /></span>)}
              {!isSelling && !isMortgage && (<span>Financiamento: {formatNumber(valorImovel-entrada, 'currency')} <br /></span>)}
              {!isSelling && !isMortgage && (<span>Juros: {formatNumber(encargosAcumulado, 'currency')} <br /></span>)}
              {!isSelling && !isMortgage && (<span>Parcela média do financiamento: {formatNumber(valorParcela, 'currency')} <br /></span>)}
              {!isSelling && (<span>ITBI: {formatNumber(valorImovel*0.03, 'currency')} <br /></span>)}
              {!isSelling && (<span>Cartório: {formatNumber(valorImovel*0.01, 'currency')} <br /></span>)}
              {!isSelling && (<span>Valorização do imóvel: {formatNumber(desvalorizacao, 'currency')} <br /></span>)}
              {isSelling && (<span>Venda do imóvel: {formatNumber(valorImovel, 'currency')} <br /></span>)}
              {isSelling && (<span>Rendimentos: {formatNumber(investimentoEntrada-valorImovel, 'currency')} <br /></span>)}
            </p>
            <p className="despesa"> Patrimônio após {tempoInvest} anos: </p>
            <p className="gastos">
              {formatNumber(resultadoCompra, 'currency')} <br />
            </p>
            </div>
            <div className={isMobile ? "panelMobile" : "panel"} >
            <h3 className='aluguel'>
              {strAluguel}
            </h3>
            <p className="gastos">
              {!isSelling && (<span>Aluguel: {formatNumber(aluguelAcumulado, 'currency')} <br /></span>)}
              {!isSelling && (<span>Valor médio do aluguel: {formatNumber(aluguelAcumulado/tempoInvest/12, 'currency')} ({formatNumber(aluguelAcumulado*100/tempoInvest/valorImovel, 'percentage')})<br /></span>)}
              {!isSelling && (<span>Investimento inicial: {formatNumber(entrada, 'currency')} <br /></span>)}
              {!isSelling && !isMortgage && (<span>Investimento adicional mensal médio: {formatNumber(valorParcela-aluguelAcumulado/tempoInvest/12, 'currency')} <br /></span>)}
              {!isSelling && (<span>Resultado investimento inicial: {formatNumber(investimentoEntrada, 'currency')} <br /></span>)}
              {!isSelling && !isMortgage && (<span>Resultado investimento mensal: {formatNumber(investimentoSaldo, 'currency')} <br /></span>)}
              {isSelling && (<span>Valor do imóvel: {formatNumber(valorImovel+desvalorizacao, 'currency')} <br /></span>)}
              {isSelling && (<span>Renda do aluguel: {formatNumber(investimentoAluguel, 'currency')} <br /></span>)}
            </p>
            <p className="despesa"> Patrimônio após {tempoInvest} anos </p>
            <p className="gastos">
              {formatNumber(resultadoAluguel, 'currency')} <br />
            </p>
          </div>
        </div>
      </Card>
      <Card>
        <ChartComponent 
          title="SELIC" line1={strCompra} line2={strAluguel} xname="Juros (%)" 
          data1={jurosData[0]} data2={jurosData[1]} categories={jurosData[2]} 
          isMobile={isMobile} />
        <ChartComponent 
          title="Inflação" line1={strCompra} line2={strAluguel} xname="Inflação (%)" 
          data1={inflacaoData[0]} data2={inflacaoData[1]} categories={inflacaoData[2]} 
          isMobile={isMobile} />
        <ChartComponent 
          title="Valorização/Depreciação" line1={strCompra} line2={strAluguel} xname="Valorização/Depreciação (%)" 
          data1={valorizacaoData[0]} data2={valorizacaoData[1]} categories={valorizacaoData[2]} 
          isMobile={isMobile} />
        <ChartComponent 
          title="Valor aluguel" line1={strCompra} line2={strAluguel} xname="Valor aluguel (R$)" 
          data1={valorAluguelData[0]} data2={valorAluguelData[1]} categories={valorAluguelData[2]} 
          isMobile={isMobile} />
        <ChartComponent 
          title="Entrada" line1={strCompra} line2={strAluguel} xname="Entrada (R$)" 
          data1={entradaData[0]} data2={entradaData[1]} categories={entradaData[2]} 
          isMobile={isMobile} />
        <ChartComponent 
          title="Juros Financiamento" line1={strCompra} line2={strAluguel} xname="Juros Financiamento (%)" 
          data1={sfhData[0]} data2={sfhData[1]} categories={sfhData[2]} 
          isMobile={isMobile} />
      </Card>
    </div>
  );
}

export default ResultsComponent;
