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
      valorAluguel: 2000,
      inflacao: 4,
      selic: 7,
      valorizacao: 4,
      tempo: 15,
      itbi: 0.,
      entrada: 200000,
      sfh: 7
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
              <li> A diferença entre o valor da parcela do financiamento e o valor do aluguel é investido mensalmente </li>
              <li> Investimentos rendem a taxa SELIC, com incidência de imposto de renda de 15% sobre os rendimentos </li>
              <li> Valores padrão baseados na Estrutura a Termo das Taxas de Juros Estimada para 10 anos ( https://www.anbima.com.br/pt_br/informar/curvas-de-juros-fechamento.htm ) </li>
              <li> Todos valores deflacionados para a moeda de hoje </li>
              <li> Valores de condomínio e IPTU não são considerados pois assume-se que serão repassados para o locatário, e, portanto, incidem igualmente nas duas opções. </li>
              <li> Financiamento pelo Sistema de Amortização Constante - SAC </li>
            </ol>
          </CardContent>
        </Card>
      </div>
      <div className="footer">
        <p> Dúvidas, sugestões e contribuições em: <a href="https://github.com/danielbm/simulador">https://github.com/danielbm/simulador</a> </p>
      </div>
    </div>
  );
}

export default App;
