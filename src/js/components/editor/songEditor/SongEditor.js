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
                [
                    {ticks: 10, color: '#abc', id: 0},
                    {ticks: 18, color: '#edf', id: 1},
                    {ticks: 18, color: '#05a', id: 2},
                    {ticks: 18, color: '#8da', id: 3},
                    {ticks: 18, color: '#edc', id: 4}
                ],[],[],[]
            ]
        }

        this.playSong = this.playSong.bind(this)
        this.exportSong = this.exportSong.bind(this)
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
                    <OneOfTheRows
                        channel={0}
                        tracks={state.channels[0]}
                    />
                    <OneOfTheRows
                        channel={1}
                        tracks={state.channels[1]}
                    />
                    <OneOfTheRows
                        channel={2}
                        tracks={state.channels[2]}
                    />
                    <OneOfTheRows
                        channel={3}
                        tracks={state.channels[3]}
                    />
                </ul>

                { state.showString ?
                    <pre style={{
                        textTransform: 'initial',
                        borderStyle: 'inset',
                        padding: 2,
                        backgroundColor: '#f3f3f3'
                    }}>
                        {this.state.songString || "Nothing to listen to yet."}
                    </pre>
                    :null
                }
            </div>
        )
    }
}

export default SongEditor

// class OneOfTheRows extends Component {
//     // constructor () {
//     //     super()

//     //     this.handleEnter = this.handleEnter.bind(this)
//     //     this.handleLeave = this.handleLeave.bind(this)
//     // }
//     // componentDidMount() {
//     //     // every li needs to be droppable
//     //     // block that's dragged away needs to be removed from channel array
//     //     // block that's added to an li needs to be added to a channel array at the correct position
//     //     // block that's rearranged needs to be rearranged in a channel array

//     //     // how do we know what index the block gets?
//     //     // position? compare with blocks left and right?

//     //     const rowElement = this.rowElement
//     //     if ( rowElement ) {
//     //         rowElement.addEventListener('dragenter', this.handleEnter )
//     //         // rowElement.addEventListener('dragleave', this.handleLeave )
//     //         // rowElement.addEventListener('dragover', this.asd)
//     //     }
//     // }

//     // asd (e) {
//     //     console.log(e)
//     // }

//     // handleEnter (e) {
//     //     console.log(e)
//     //     if ( e.target.classList.contains('thingy') ) {
//     //         this.setState({
//     //             target: e
//     //         })
//     //     } else if ( e.target.classList.contains('') ) {
//     //         this.setState({
//     //             target: null
//     //         })
//     //     }
//     // }

//     // // handleLeave (e) {
//     // //     this.setState({
//     // //         target: null
//     // //     })
//     // // }

//     render () {
//         const props = this.props
//         return (
//             <li className="song-editor-channels-item">
//             {/*<li className="song-editor-channels-item" ref={ e => this.rowElement = e }>*/}
//                 <div className="song-editor-channels-item-name">
//                     <span><i className="fa fa-music" aria-hidden="true"></i></span>
//                     <span>{`CH ${props.channel}`}</span>
//                 </div>
//                 <div className="song-editor-channels-item-editor">
//                     <ListOfTracks
//                         tracks={props.tracks}
//                     />
//                 </div>
//             </li>
//         )
//     }
// }

const OneOfTheRows = ({channel, tracks}) =>
    <li className="song-editor-channels-item">
        <div className="song-editor-channels-item-name">
            <span><i className="fa fa-music" aria-hidden="true"></i></span>
            <span>{`CH ${channel}`}</span>
        </div>
        <div className="song-editor-channels-item-editor">
            <ListOfTracks
                tracks={tracks}
            />
        </div>
    </li>
