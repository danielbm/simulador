

export const formatNumber = (text, style) => {
  if (style === 'currency') {
    return new Intl.NumberFormat('pt-BR', { style: style, currency: 'BRL'}).format(text)
  } else if (style === 'percentage') {
    return text+'%'
  } else {
    return text
  }
}
