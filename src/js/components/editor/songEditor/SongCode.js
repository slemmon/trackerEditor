import { connect } from 'react-redux'
import React, { Component } from 'react'

const mapStateToProps = (state) => {
    return {
        code: state.song.code
    }
}

const SongCodeView = ({code, show}) =>
    <pre style={{
        textTransform: 'initial',
        borderStyle: 'double',
        borderWidth: '5px',
        padding: 12,
        backgroundColor: '#f3f3f3',
        maxHeight: '300px',
        overflowY: 'auto',
        display: `${show ? '' : 'none'}`
    }}>
        {code}
    </pre>

const SongCode = connect(
    mapStateToProps
)(SongCodeView)

export default SongCode