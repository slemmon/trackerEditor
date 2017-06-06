import React, { Component } from 'react'
import { connect } from 'react-redux'

class LoaderView extends Component {
    constructor () {
        super()

        this.saveJSON = this.saveJSON.bind(this)
        this.loadJSON = this.loadJSON.bind(this)
        this.handleFileChange = this.handleFileChange.bind(this)
    }
    componentDidMount () {
        document.addEventListener('saveJSON', this.saveJSON)
        document.addEventListener('loadJSON', this.loadJSON)
    }

    saveJSON (e) {

        // get fx, tracks, channels
        const props = this.props
        const saveData = {
            fx: props.fx,
            channels: props.channels,
            tracks: props.tracks
        }

        // make the browser download the file
        const download = document.createElement('a')
        download.href = `data:text/plain;charset=utf-8;base64,${btoa(JSON.stringify(saveData))}`
        download.download = 'song.atm'

        document.body.appendChild(download)
        download.click()
        document.body.removeChild(download)

    }

    loadJSON (e) {
        this.fileInput.click()
    }

    handleFileChange (e) {
        const file = e.target.files[0]

        const reader = new FileReader()

        let result
        reader.onloadend = () => {
            try {
                result = JSON.parse(reader.result)
            }
            catch (error) {
                return alert('invalid file (1)')
            }

            if ( this.validateFile(result) ) {

                // backwards compatibility with older saved files
                if ( Array.isArray(result.fx) )
                    result.fx = {
                        "enabled": false,
                        "status": {
                          "fxType": "",
                          "id": 0
                        },
                        "channel": JSON.parse(JSON.stringify(result.fx).replace(/val_b/g, 'val_1').replace(/val"/g, 'val_0"')),
                        "track": []
                      }
                this.props.setLoadedData(result)
            } else {
                return alert('invalid file (2)')
            }

        }

        reader.readAsText(file)

        e.target.value = ''

    }

    validateFile (file) {

        let truths = 0

        const names = Object.getOwnPropertyNames(file)

        if ( names.length === 3 ) truths++

        for ( const name of names ) {

            switch (name) {
                case 'channels':
                case 'tracks':
                truths++
                if ( Array.isArray(file[name]) ) truths++
                break

                case 'fx':
                truths++
                if ( Object.prototype.toString.apply(file.fx).slice(8, -1) === 'Object' ) truths++
            }

        }

        if ( truths === 6 && Array.isArray(file.fx) )
            return true

        return truths === 7

    }

    render () {
        return (
            <input
                className="hidden-file-input"
                type="file"
                accept=".atm"
                ref={ el => this.fileInput = el }
                onChange={ this.handleFileChange }
            />
        )
    }
}

const mapStateToProps = (state) => {
    return {
        tracks: state.tracks,
        channels: state.channels,
        fx: state.fx
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setLoadedData ({channels, tracks, fx} = data) {
            dispatch({
                type: 'STATUS_SET',
                status: 1
            })
            dispatch({
                type: 'SET_ACTIVE_TRACK',
                track: {notes: []}
            })
            dispatch({
                type: 'TRACK_SET_DATA',
                tracks
            })
            dispatch({
                type: 'FX_SET_DATA',
                fx
            })
            dispatch({
                type: 'CHANNEL_SET_DATA',
                channels
            })
            dispatch({
                type: 'STATUS_SET',
                status: 0
            })
        }
    }
}

const Loader = connect(
    mapStateToProps,
    mapDispatchToProps
)(LoaderView)

export default Loader
