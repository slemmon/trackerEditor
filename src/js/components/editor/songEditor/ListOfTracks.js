import React, { Component } from 'react'

class ListOfTracks extends Component {
    componentDidMount() {
        // all blocks need to be draggable
    }

    render () {
        const tracks = this.props.tracks
        return (
            <div className="idk">
                {tracks.map( t =>
                    <span key={t.id} className="thingy" style={{width: t.ticks*2, backgroundColor: t.color}}></span>
                )}
            </div>
        )
    }
}

export default ListOfTracks
