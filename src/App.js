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
      inflacao: 3.98,
      selic: 7.1,
      valorizacao: 3.98,
      tempo: 10,
      itbi: 0.,
      entrada: 200000,
      sfh: 8.8
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
      <div className="header" > Simulador do imóvel: comprar ou alugar? </div>
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
