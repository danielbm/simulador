import React from "react";
import Results from './Components/ResultsComponent.js';
import InputPanelComponent from './Components/InputPanelComponent.js'
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
      alert(JSON.stringify(values, null, 2));
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
      <div className="footer">
        <p> Dúvidas, sugestões e contribuições em: <a href="https://github.com/danielbm/simulador">https://github.com/danielbm/simulador</a> </p>
      </div>
    </div>
  );
}

export default App;
