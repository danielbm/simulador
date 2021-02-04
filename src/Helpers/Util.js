

export const truncate = (num) => {
  return Math.round(num*100)/100
}

export const formatNumber = (text, style) => {
  if (style === 'currency') {
    return new Intl.NumberFormat('pt-BR', { style: style, currency: 'BRL'}).format(truncate(text))
  } else if (style === 'percentage') {
    return truncate(text)+'%'
  } else {
    return truncate(text)
  }
}
