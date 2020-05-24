import React from "react";
import { TextField, Card, CardContent, InputAdornment } from '@material-ui/core'
import {DebounceInput} from 'react-debounce-input'
import './InputPanelComponentStyle.css'

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

  const { formik } = props

  return (
    <Card>
      <CardContent>
        <form onSubmit={formik.handleSubmit}>
          <p> Dados do imóvel </p>
          <div className="inputContainer">
            {generateTextField("R$", null, "Valor do Imóvel", "valorImovel", formik)}
            {generateTextField("R$", null, "Valor do Aluguel", "valorAluguel", formik)}
            {generateTextField(null, "%", "Valorização/Depreciação", "valorizacao", formik)}
            {generateTextField(null, "%", "Inflação", "inflacao", formik)}
            {generateTextField(null, "%", "Taxa SELIC", "selic", formik)}
            {generateTextField("R$", null, "Entrada", "entrada", formik)}
            {generateTextField(null, "%", "Taxa Financiamento", "sfh", formik)}
            {generateTextField(null, "anos", "Tempo", "tempo", formik)}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export default InputPanelComponent;
