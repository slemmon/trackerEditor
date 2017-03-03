import React from 'react'

const ArrowIcon = ({size, color, customStyle}) =>
    <svg style={Object.assign({height: size, fill: color}, customStyle)} version="1.1" x="0px" y="0px" viewBox="6 6 12 12">
        <path id="arrow" d="M17.5,11H12V8.091c0-0.275-0.174-0.357-0.387-0.183l-5.226,4.276c-0.213,0.174-0.213,0.459,0,0.633l5.226,4.276
        C11.826,17.267,12,17.184,12,16.909V14h5.5c0.275,0,0.5-0.225,0.5-0.5v-2C18,11.225,17.775,11,17.5,11z"/>
    </svg>

export default ArrowIcon
