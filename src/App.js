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
      tempo: 10,
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
        <h1> Comprar ou alugar? </h1>
        <p> Faça a simulação das principais variáveis </p>
      </div>
      <InputPanelComponent formik={formik}/>
      <Results
        values={formik.values}
      />
      <div className="method">
        <Card>
          <CardContent>
            Metodologia:
            <ol>
              <li> Reajuste do aluguel na proporção da valorização do imóvel </li>
              <li> A diferença entre o valor da parcela do financiamento e o valor do aluguel é investido mensalmente </li>
              <li> Investimentos rendem a taxa SELIC, com incidência de imposto de renda de 15% sobre os rendimentos </li>
              <li> Valores padrão baseados na Estrutura a Termo das Taxas de Juros Estimada para 10 anos ( https://www.anbima.com.br/pt_br/informar/curvas-de-juros-fechamento.htm ) </li>
              <li> Todos valores deflacionados para a moeda de hoje </li>
            </ol>
            Estudo completo: 
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
