import color from 'color'

const colors = [
    '#ff7e00', '#ff69a8', '#00a8cc', '#00d2ae', '#584d4d', '#7171d8', '#df2020',
    '#24eb24', '#ffcc99', '#ffbdd8', '#85e9ff', '#75ffe8', '#aea2a2', '#b7b7eb',
    '#ef8f8f', '#98f598'
]
const colorsArr = colors.map(hex => color(hex))
const colorsHex = colorsArr.map(colorObj => colorObj.hex())
const colorsObj = {}

colorsArr.forEach((colorObj, i) => {
    const [ r, g, b ] = colorObj.rgb().array()

    colorsObj[i] = {
        hex: colorObj.hex(),
        rgb: { r, g, b }
    }
})

export { colorsObj, colorsHex }