import React, { useState, useEffect }  from "react";
import { TextField, Card, CardContent, InputAdornment, Switch } from '@material-ui/core'
import PulseLoader from 'react-spinners/PulseLoader'
import {DebounceInput} from 'react-debounce-input'
import './InputPanelComponentStyle.css'
import { truncate } from '../Helpers/Util.js'
import axios from 'axios'
import convert from 'xml-js'

const generateTextField = (startAdornment, endAdornment, label, name, formik, inputSwitch) => {
  //return <DebounceInput debounceTimeout={1000} className="textField" label={label} type="text" name={name} value={formik.values[name]} onChange={formik.handleChange} />
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
      disabled={inputSwitch}
    />
  )
}


function InputPanelComponent(props) {
  // const isMobile = useMediaQuery('(max-width:600px)');
  const [inputSwitch, setInputSwitch] = useState(true)
  const [ettj, setEttj] = useState(null)


  const { formik } = props
  const defaultInputs = (toggle) => {
    formik.setFieldValue("inflacao", ettj[0])
    formik.setFieldValue("selic", ettj[1])
    formik.setFieldValue("sfh", truncate(ettj[1]+2))
    formik.setFieldValue("valorizacao", ettj[0])
    setInputSwitch(!toggle)
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
          <p> Dados do imóvel </p>
          <div className="inputContainer">
            {generateTextField("R$", null, "Valor do Imóvel", "valorImovel", formik)}
            {generateTextField("R$", null, "Valor do Aluguel", "valorAluguel", formik)}
          </div>
          <div className="inputContainer">
            {generateTextField("R$", null, "Entrada", "entrada", formik)}
            {generateTextField(null, "anos", "Tempo de financiamento", "tempo", formik)}
          </div>
          <p> Condições </p>
          <div className="switch">
            <Switch
              checked={inputSwitch}
              onChange={() => defaultInputs(inputSwitch)}
              name="switch"
              size="small"
              color="primary"
              inputProps={{ 'aria-label': 'secondary checkbox' }}
            /> Utilizar valores padrão
          </div>
          { ettj ? (
          <div className="inputContainer">
            {generateTextField(null, "% a.a", "Inflação", "inflacao", formik, inputSwitch)}
            {generateTextField(null, "% a.a", "Taxa SELIC", "selic", formik, inputSwitch)}
          </div>
          ) : <PulseLoader />}
          { ettj ? (
          <div className="inputContainer">
            {generateTextField(null, "% a.a", "Valorização", "valorizacao", formik, inputSwitch)}
            {generateTextField(null, "% a.a", "Taxa Financiamento", "sfh", formik, inputSwitch)}
          </div>
        ) : null}
        </form>
      </CardContent>
    </Card>
  );
}

export default InputPanelComponent;
