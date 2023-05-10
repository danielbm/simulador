import React from "react";
import Results from './Components/ResultsComponent.js';
import InputPanelComponent from './Components/InputPanelComponent.js'
import { Card, CardContent } from "@material-ui/core";
import { useFormik } from 'formik';

import './App.css';

function App() {
  // const isMobile = useMediaQuery('(max-width:600px)');

  const formik = useFormik({
    initialValues: {
      valorImovel: 500000,
      valorAluguel: 1800,
      inflacao: 6.1,
      selic: 12.25,
      valorizacao: 7.1,
      tempo: 15,
      itbi: 0.,
      entrada: 200000,
      sfh: 13.25,
      isMortgage: false
    },
    onSubmit: values => {

    },
    validate: values => {
      const errors = {};
      if (!values.valorImovel) {
        errors.valorImovel = 'Campo obrigatório';
      } else if (!values.tempo) {
        errors.tempo = 'Campo obrigatório';
      }
      for (let name in values) {
        if (isNaN(values[name])) {
          if (values[name].includes(',')) {
            errors[name] = 'Use ponto ao invés de vírgula'
          } else {
            errors[name] = 'Formato numérico incorreto'
          }
        }
      }
      return errors;
    }
  });

  return (
    <div className="App">
      <div className="header" >
        <h1> <span className='compra'>Comprar</span> ou <span className='aluguel'>alugar</span>? </h1>
      </div>
      {/* <Card style={{backgroundColor: "#"}}>
        <p> Faça a sua própria simulação </p>
      </Card> */}
      <InputPanelComponent formik={formik}/>
      <Results
        values={formik.values}
      />
      <div className="method">
        <Card>
          <CardContent>
            Observações:
            <ol>
              <li> Reajuste do aluguel na proporção da valorização do imóvel </li>
              <li> A diferença entre o valor da parcela do financiamento e o valor do aluguel, quando positiva, é investida mensalmente </li>
              <li> Investimentos rendem a taxa SELIC, com incidência de imposto de renda de 15% sobre os rendimentos </li>
              <li> Valores padrão baseados na Estrutura a Termo das Taxas de Juros Estimada para 10 anos no dia 06/05/23 ( https://www.anbima.com.br/pt_br/informar/curvas-de-juros-fechamento.htm ) </li>
              <li> Todos valores deflacionados para a moeda de hoje </li>
              <li> Valores de condomínio e IPTU não são considerados pois assume-se que serão repassados para o locatário, e, portanto, incidem igualmente nas duas opções. </li>
              <li> Financiamento pelo Sistema de Amortização Constante - SAC </li>
              <li> ITBI 3% e custas cartorárias 1% do valor do imóvel </li>

            </ol>
          </CardContent>
        </Card>
      </div>
      <div className="footer">
        <p> Dúvidas, sugestões e contribuições em: <a href="https://github.com/danielbm/simulador">https://github.com/danielbm/simulador</a> e <a href="https://twitter.com/danielbrasilm1">https://twitter.com/danielbrasilm1</a> </p>
        <p> Conheça também a ferramenta de análise da inflação: <a href="https://www.considereainflacao.com.br">https://www.considereainflacao.com.br</a> </p>
      </div>
    </div>
  );
}

export default App;
