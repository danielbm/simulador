import React  from "react";
import { TextField, Card, CardContent, InputAdornment, Switch } from '@material-ui/core'
import {DebounceInput} from 'react-debounce-input'
import useMediaQuery from '@material-ui/core/useMediaQuery';
import './InputPanelComponentStyle.css'

const generateTextField = (startAdornment, endAdornment, label, name, formik, disabled) => {
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
      helperText={formik.errors[name]}
      error={formik.errors[name] ? true : false}
      margin="normal"
      disabled={disabled}
    />
  )
}


function InputPanelComponent(props) {
  const isMobile = useMediaQuery('(max-width:600px)');
  // const [ isMortgage, setIsMortgage ] = useState(true)

  const { formik } = props

  return (
    <Card>
      <CardContent>
        <form onSubmit={formik.handleSubmit}>
          <p> Parâmetros </p>
          <div className={`inputContainer ${isMobile ? 'wrap' : ''}`}>
            <div className={`inputColumn ${isMobile ? 'withMargin' : ''}`}>
              {generateTextField("R$", null, "Valor do Imóvel", "valorImovel", formik, false)}
              {generateTextField(null, "% a.a", "Inflação", "inflacao", formik, false)}
              {generateTextField(null, "% a.a", "Valorização do imóvel", "valorizacao", formik, false)}
              {generateTextField(null, "anos", "Tempo de investimento", "tempo", formik, false)}
            </div>
            <div className={`inputColumn ${isMobile ? 'withMargin' : ''}`}>
              {generateTextField("R$", null, "Valor do Aluguel (mensal)", "valorAluguel", formik, false)}
              {generateTextField(null, "% a.a", "Taxa SELIC", "selic", formik, false)}
              {generateTextField("R$", null, "Entrada", "entrada", formik, formik.values.isMortgage)}
              {generateTextField(null, "% a.a", "Juros do financiamento", "sfh", formik, formik.values.isMortgage)}
            </div>
          </div>
          <div className={`buttonsContainer ${isMobile ? 'withMargin' : ''}`}>
            <Switch
              onClick={formik.handleChange}
              value={formik.values.isMortgage}
              name="isMortgage"
              size="small"
              color="primary"
              variant="outlined"
            /> Compra à vista
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export default InputPanelComponent;
