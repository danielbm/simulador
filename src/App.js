import React from "react";
import './App.css';
import Results from './Results.js';
import { useFormik } from 'formik';
import { TextField, Button, Container } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import CssBaseline from '@material-ui/core/CssBaseline';


const useStyles = makeStyles(theme => ({
  main: {
    paddingLeft: 0,
    paddingRight: 0,
  },
  row: {
    display: "flex",
    justifyContent: "space-around",
  },
  formContainer: {
    display: "flex",
    justifyContent: "space-around",
    flexWrap: "wrap"
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200
  },
}));

function App() {
  const classes = useStyles();
  const isMobile = useMediaQuery('(max-width:600px)');

  const formik = useFormik({
    initialValues: {
      valorImovel: 600000,
      valorAluguel: 2300,
      inflacao: 0.04,
      selic: 0.06,
      valorizacao: 0.04,
      tempo: 10,
      investimento: 3500,
      itbi: 0.03,
      entrada: 200000,
      sfh: 0.0882
    },
    onSubmit: values => {
      alert(JSON.stringify(values, null, 2));
    },
  });

  return (
    <Container maxWidth="md" minWidth={480} className={classes.main}>
      <CssBaseline />
      <div className={classes.row}>
        <form onSubmit={formik.handleSubmit} className={classes.formContainer}>
          <TextField className={classes.textField} label="Valor do imóvel" type="text" name="valorImovel" value={formik.values.valorImovel} onChange={formik.handleChange} />
          <TextField className={classes.textField} label="Valor do aluguel" type="text" name="valorAluguel" value={formik.values.valorAluguel} onChange={formik.handleChange} />
          <TextField className={classes.textField} label="Inflação" type="text" name="inflacao" value={formik.values.inflacao} onChange={formik.handleChange} />
          <TextField className={classes.textField} label="Taxa SELIC" type="text" name="selic" value={formik.values.selic} onChange={formik.handleChange} />
          <TextField className={classes.textField} label="Valorização/Depreciação" type="text" name="valorizacao" value={formik.values.valorizacao} onChange={formik.handleChange} />
          <TextField className={classes.textField} label="Tempo (anos)" type="text" name="tempo" value={formik.values.tempo} onChange={formik.handleChange} />
          <TextField className={classes.textField} label="Investimento mensal" type="text" name="investimento" value={formik.values.investimento} onChange={formik.handleChange} />
          <TextField className={classes.textField} label="ITBI" type="text" name="itbi" value={formik.values.itbi} onChange={formik.handleChange} />
          <TextField className={classes.textField} label="Entrada" type="text" name="entrada" value={formik.values.entrada} onChange={formik.handleChange} />
          <TextField className={classes.textField} label="Taxa financiamento" type="text" name="sfh" value={formik.values.sfh} onChange={formik.handleChange} />
        </form>
      </div>
      <div className={classes.row}>
        <Results 
          values={formik.values}
        />
      </div>
    </Container>
  );
}

export default App;
