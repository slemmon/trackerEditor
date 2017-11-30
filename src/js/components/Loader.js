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

        // get fx, patterns, channels, and songName
        const { channels, fx, songName, songRepeat, patterns  } = this.props
        const saveData = {
            fx: fx,
            channels: channels,
            patterns: patterns,
            meta: {
                name: songName,
                songRepeat
            }
        }

        // make the browser download the file
        const download = document.createElement('a')
        download.href = `data:text/plain;charset=utf-8;base64,${btoa(JSON.stringify(saveData))}`
        download.download = `${songName}.atm`

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
                        "pattern": []
                      }
                const fileName = file.name.replace('.atm', '')
                result.meta = result.meta || {}
                result.meta.name = result.meta.name || fileName

                // replace occurrences of "track" with "pattern" in existing
                // files ... except in the song name
                const meta = result.meta
                delete result.meta
                let resultString = JSON.stringify(result)
                resultString = resultString.replace(/track/g, 'pattern')
                               .replace(/Track/g, 'Pattern')
                               .replace(/TRACK/g, 'TRACK')
                result = JSON.parse(resultString)
                result.meta = meta

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

        if ( names.length === 3 || names.length === 4 ) truths++

        for ( const name of names ) {

            switch (name) {
                case 'channels':
                case 'patterns':
                truths++
                if ( Array.isArray(file[name]) ) truths++
                break

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

const mapStateToProps = ({ channels, fx, songName, songRepeat, patterns }) => {
    return {
        channels,
        fx,
        songName,
        songRepeat,
        patterns
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setLoadedData ({channels, fx, meta, patterns, tracks} = data) {
            const { name = '', songRepeat = false } = meta
            patterns = patterns || tracks

            dispatch({
                type: 'STATUS_SET',
                status: 1
            })
            dispatch({
                type: 'SET_ACTIVE_PATTERN',
                pattern: {notes: []}
            })
            if (patterns && patterns.length) {
                dispatch({
                    type: 'SET_ACTIVE_PATTERN_TYPE',
                    patternType: patterns[patterns.length - 1].type
                })
            }
            dispatch({
                type: 'PATTERN_SET_DATA',
                patterns
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
            dispatch({
                type: 'SET_SONG_NAME',
                songName: name
            })
            dispatch({
                type: "TOGGLE_SONG_REPEAT",
                repeat: songRepeat
            })
        }
    }
}

const Loader = connect(
    mapStateToProps,
    mapDispatchToProps
)(LoaderView)

export default Loader
