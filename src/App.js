import React from "react";
import './App.css';
import Results from './Results.js';
import { useFormik } from 'formik';
import { TextField, Button, Container, Card, CardContent,Typography, Box  } from '@material-ui/core'
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
    // display: "flex",
    // justifyContent: "space-around",
    // flexWrap: "wrap"
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    // width: 200
  },
  card: {
    marginTop: 10
  }
}));

function App() {
  const classes = useStyles();
  const isMobile = useMediaQuery('(max-width:600px)');

  const formik = useFormik({
    initialValues: {
      valorImovel: 500000,
      valorAluguel: 2000,
      inflacao: 0.0398,
      selic: 0.071,
      valorizacao: 0.0389,
      tempo: 10,
      itbi: 0.03,
      entrada: 200000,
      sfh: 0.088
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
    <Container maxWidth="md" minWidth={480} className={classes.main}>
      <CssBaseline />
      <Typography variant="h4" align="center"> Calculadora do imóvel: comprar ou alugar? </Typography>
      <Card className={classes.card}>
        <CardContent>
          <form onSubmit={formik.handleSubmit} className={classes.formContainer}>
            <Box py={2}>
              <Typography align="center"> Dados do imóvel </Typography>
              <Box display="flex" justifyContent="space-around" flexWrap="wrap">
                <TextField className={classes.textField} label="Valor do imóvel" type="text" name="valorImovel" value={formik.values.valorImovel} onChange={formik.handleChange} />
                <TextField className={classes.textField} label="Valor do aluguel" type="text" name="valorAluguel" value={formik.values.valorAluguel} onChange={formik.handleChange} />
                <TextField className={classes.textField} label="Valorização/Depreciação" type="text" name="valorizacao" value={formik.values.valorizacao} onChange={formik.handleChange} /> 
              </Box>
            </Box>
            <Box borderTop={1} borderColor="#ccc" py={2}>
              <Typography align="center"> Premissas </Typography>
              <Box display="flex" justifyContent="space-around" flexWrap="wrap">
                <TextField className={classes.textField} label="Inflação" type="text" name="inflacao" value={formik.values.inflacao} onChange={formik.handleChange} />
                <TextField className={classes.textField} label="Taxa SELIC" type="text" name="selic" value={formik.values.selic} onChange={formik.handleChange} />
                <TextField className={classes.textField} label="ITBI" type="text" name="itbi" value={formik.values.itbi} onChange={formik.handleChange} />
              </Box>
            </Box>
            <Box borderTop={1} borderColor="#ccc" py={2}>
              <Typography align="center"> Financiamento </Typography>
              <Box display="flex" justifyContent="space-around" flexWrap="wrap">
                <TextField className={classes.textField} label="Entrada" type="text" name="entrada" value={formik.values.entrada} onChange={formik.handleChange} />
                <TextField className={classes.textField} label="Taxa financiamento" type="text" name="sfh" value={formik.values.sfh} onChange={formik.handleChange} />
                <TextField className={classes.textField} label="Tempo (anos)" type="text" name="tempo" value={formik.values.tempo} onChange={formik.handleChange} />
              </Box>
            </Box>
          </form>
        </CardContent>
      </Card>
      {/* <Card className={classes.card}>
        <CardContent className={classes.row}>
          <Typography> Juros futuro (2029)*: <b>7,10%</b> </Typography >
          <Typography> IPCA futuro (2029)*: <b>3,98%</b> </Typography>
        </CardContent>
        <CardContent className={classes.row}>
          <Typography> Taxa Caixa**: <b>8,21%</b> </Typography>
          <Typography> ITBI em São Paulo: <b>3%</b> </Typography>
        </CardContent>
        <CardContent>
          <p><a href="https://www.anbima.com.br/pt_br/informar/curvas-de-juros-fechamento.htm">* https://www.anbima.com.br/pt_br/informar/curvas-de-juros-fechamento.htm</a></p>
          <p><a href="http://www8.caixa.gov.br/siopiinternet-web/simulaOperacaoInternet.do?method=inicializarCasoUso">** http://www8.caixa.gov.br/siopiinternet-web/simulaOperacaoInternet.do?method=inicializarCasoUso</a></p>
        </CardContent>
      </Card> */}
            <Results 
              values={formik.values}
            />
    </Container>
  );
}

export default App;
