import React, { Component } from 'react'
import createSong from './createSong'
import ListOfTracks from './ListOfTracks'

class SongEditor extends Component {
    constructor (props) {
        super(props)

        this.state = {
            song: [],
            songString: '',
            showString: false,
            channels: [
                [{ticks: 10, color: '#abc', id: 0}, {ticks: 18, color: '#edf', id: 1}],[],[],[]
            ]
        }

        this.playSong = this.playSong.bind(this)
        this.exportSong = this.exportSong.bind(this)
    }

    componentDidMount() {
        // every li needs to be droppable
        // block that's dragged away needs to be removed from channel array
        // block that's added to an li needs to be added to a channel array at the correct position
        // block that's rearranged needs to be rearranged in a channel array

        // how do we know what index the block gets?
        // position? compare with blocks left and right?
    }

    playSong () {
        const updatedSong = createSong(this.props.tracks)
        this.setState(updatedSong)
        if ( !updatedSong.song.length ) return
        this.props.playSong(updatedSong.song, true)
    }

    exportSong () {
        this.setState({
            showString: !this.state.showString
        })
        this.setState(createSong(this.props.tracks))
    }

    render () {
        const state = this.state
        return (
            <div id="song-editor-container">
                <h5>Song editor</h5>
                <button onClick={ this.playSong }>Play</button>
                {/*<button>Pause</button>*/}
                <button onClick={ this.props.stopSong }>Stop</button>
                <button onClick={ this.exportSong }>Export song</button>

                <ul className="song-editor-channels">
                    <li className="song-editor-channels-item">
                        <div className="song-editor-channels-item-name">
                            <span><i className="fa fa-music" aria-hidden="true"></i></span>
                            <span>CH 0</span>
                        </div>
                        <div className="song-editor-channels-item-editor">
                            <ListOfTracks
                                tracks={state.channels[0]}
                            />
                        </div>
                    </li>

                    <li className="song-editor-channels-item">
                        <div className="song-editor-channels-item-name">
                            <span><i className="fa fa-music" aria-hidden="true"></i></span>
                            <span>CH 1</span>
                        </div>
                        <div className="song-editor-channels-item-editor">
                        </div>
                    </li>

                    <li className="song-editor-channels-item">
                        <div className="song-editor-channels-item-name">
                            <span><i className="fa fa-music" aria-hidden="true"></i></span>
                            <span>CH 2</span>
                        </div>
                        <div className="song-editor-channels-item-editor">
                        </div>
                    </li>

                    <li className="song-editor-channels-item">
                        <div className="song-editor-channels-item-name">
                            <span><i className="fa fa-music" aria-hidden="true"></i></span>
                            <span>CH 3</span>
                        </div>
                        <div className="song-editor-channels-item-editor">
                        </div>
                    </li>
                </ul>

                { state.showString ?
                    <pre>
                        {this.state.songString || "Nothing to listen to yet."}
                    </pre>
                    :null
                }
            </div>
        )
    }
}

export default SongEditor
