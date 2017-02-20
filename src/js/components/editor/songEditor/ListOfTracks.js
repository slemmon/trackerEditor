import React, { Component } from 'react'

class ListOfTracks extends Component {
    constructor () {
        super()

        this.state = {
            target: null
        }

        this.handleEnter = this.handleEnter.bind(this)
    }

    componentDidMount() {
        // every li needs to be droppable
        // block that's dragged away needs to be removed from channel array
        // block that's added to an li needs to be added to a channel array at the correct position
        // block that's rearranged needs to be rearranged in a channel array

        // how do we know what index the block gets?
        // position? compare with blocks left and right?
        const rowElement = this.rowElement
        if ( rowElement ) {
            rowElement.addEventListener('dragenter', this.handleEnter )
            // rowElement.addEventListener('dragleave', this.handleLeave )
            // rowElement.addEventListener('dragover', this.asd)
        }
    }

    handleEnter (e) {
        console.log(e)
        if ( e.target.classList.contains('thingy') ) {
            console.log('set new target')
            this.setState({
                target: e
            })
        } else if ( e.target.classList.contains('idk') ) {
            console.log('clear target')
            this.setState({
                target: null
            })
        }
    }

    render () {
        const tracks = this.props.tracks
        return (
            <div
                className="idk"
                ref={ e => this.rowElement = e }
            >
                {tracks.map( t =>
                    <Track
                        key={t.id}
                        track={t}
                    />
                )}
            </div>
        )
    }
}

export default ListOfTracks

class Track extends Component {
    constructor () {
        super()

        this.state = {
            imBeingDragged: false
        }

        this.handleDragStart = this.handleDragStart.bind(this)
        this.handleDragEnd = this.handleDragEnd.bind(this)
    }

    componentDidMount() {
        // all blocks need to be draggable
        const el = this.element
        if ( el ) {
            el.addEventListener('dragstart', this.handleDragStart )
            el.addEventListener('dragend', this.handleDragEnd )
            el.draggable = true
        }
    }

    handleDragStart (e) {
        console.log('start')
        setTimeout(
            () => this.setState({imBeingDragged: true}),
            // () => el.classList.add('hidden'),
            1
        )
    }

    handleDragEnd (e) {
        console.log('stop')
        this.setState({imBeingDragged: false})
        // el.classList.remove('hidden')
    }

    render () {
        const track = this.props.track
        return (
            <span
                ref={ e => this.element = e }
                className={`thingy ${this.state.imBeingDragged ? 'beingdragged' : ''}`}
                style={{width: track.ticks*2, backgroundColor: track.color}}
            >
            </span>
        )
    }
}
