import React, { useState, useEffect }  from "react";
import { TextField, Card, CardContent, InputAdornment } from '@material-ui/core'
import PulseLoader from 'react-spinners/PulseLoader'
import {DebounceInput} from 'react-debounce-input'
import './InputPanelComponentStyle.css'
import { truncate } from '../Helpers/Util.js'
import axios from 'axios'
import convert from 'xml-js'

const generateTextField = (startAdornment, endAdornment, label, name, formik) => {
  return (
    <TextField
      InputProps={{
        startAdornment: startAdornment && <InputAdornment position="start">{startAdornment}</InputAdornment>,
        endAdornment: endAdornment && <InputAdornment position="start">{endAdornment}</InputAdornment>,
        inputComponent: DebounceInput,
      }}
      inputProps={{
        debounceTimeout: 1000
      }}
      className="textField" label={label} type="text" name={name} value={formik.values[name]} onChange={formik.handleChange}
      margin="normal"
    />
  )
}


function InputPanelComponent(props) {
  // const isMobile = useMediaQuery('(max-width:600px)');
  const [ettj, setEttj] = useState(null)


  const { formik } = props

  const toggleMortage = (toggle) => {
    formik.setFieldValue("entrada", formik.values.valorImovel)
    formik.setFieldValue("tempo", 0)
  }

  const toggleDefault = (toggle) => {
    formik.setFieldValue("inflacao", ettj[0])
    formik.setFieldValue("selic", ettj[1])
    formik.setFieldValue("sfh", truncate(ettj[1]+2))
    formik.setFieldValue("valorizacao", ettj[0])
    formik.setFieldValue("entrada", formik.values.valorImovel)
    formik.setFieldValue("tempo", 15)
  }

  useEffect(() => {
    axios({
      method: 'post',
      url: 'https://cors-anywhere.herokuapp.com/https://www.anbima.com.br/informacoes/est-termo/CZ-down.asp',
      data: 'escolha=2&Idioma=PT&saida=xml&Dt_Ref=16/06/2020',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then(function (response) {
      const json = convert.xml2js(response.data, {compact: true})
      let ettjInflacao = formik.values.inflacao
      let ettjJuros = formik.values.selic
      if ("ETTJ" in json["CURVAZERO"]) {
        const tenEttj = json["CURVAZERO"]["ETTJ"]["VERTICES"][19]["_attributes"]
        ettjInflacao = truncate(Number(tenEttj["Inflacao"].replace(",",".")))
        ettjJuros = truncate(Number(tenEttj["Prefixados"].replace(",",".")))
      }
      setEttj([ettjInflacao, ettjJuros])
      formik.setFieldValue("inflacao", ettjInflacao)
      formik.setFieldValue("selic", ettjJuros)
      formik.setFieldValue("sfh", truncate(ettjJuros+2))
      formik.setFieldValue("valorizacao", ettjInflacao)
    }).catch(function (error) {
      setEttj([formik.values.inflacao, formik.values.selic])
    });
  }, []);

  return (
    <Card>
      <CardContent>
        <form onSubmit={formik.handleSubmit}>
          <p> Parâmetros </p>
          <div className="inputContainer">
            {generateTextField("R$", null, "Valor do Imóvel", "valorImovel", formik)}
            {generateTextField("R$", null, "Valor do Aluguel (mensal)", "valorAluguel", formik)}
          </div>
          <div className="inputContainer">
            {generateTextField(null, "% a.a", "Taxa SELIC", "selic", formik)}
            {generateTextField("R$", null, "Entrada", "entrada", formik)}
          </div>
          { ettj ? (
          <div className="inputContainer">
            {generateTextField(null, "% a.a", "Inflação", "inflacao", formik)}
            {generateTextField(null, "anos", "Tempo de financiamento", "tempo", formik)}
          </div>
          ) : <PulseLoader />}
          { ettj ? (
          <div className="inputContainer">
            {generateTextField(null, "% a.a", "Valorização do imóvel", "valorizacao", formik)}
            {generateTextField(null, "% a.a", "Juros do financiamento", "sfh", formik)}
          </div>
        ) : null}
          {/* <div className="buttonsContainer">
            <Button
              onClick={() => toggleMortage()}
              size="small"
              color="secondary"
              variant="outlined"
              className="button"
            > Sem financiamento </Button>
            <Button
              onClick={() => toggleDefault()}
              size="small"
              color="secondary"
              variant="outlined"
              mt={10}
            > Resetar condições </Button>
          </div> */}
        </form>
      </CardContent>
    </Card>
  );
}

export default InputPanelComponent;
