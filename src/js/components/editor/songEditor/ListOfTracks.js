import React, { Component } from 'react'

class ListOfTracks extends Component {
    constructor () {
        super()

        this.state = {
            target: null,
            originalPos: null
        }

        this.handleEnter = this.handleEnter.bind(this)
        this.handleLeave = this.handleLeave.bind(this)
        this.confirmDrag = this.confirmDrag.bind(this)
        this.handleDrop = this.handleDrop.bind(this)
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
            rowElement.addEventListener('dragleave', this.handleLeave )
            rowElement.addEventListener('dragover', this.handleDragover )
            rowElement.addEventListener('drop', this.handleDrop )
        }
    }

    // componentWillReceiveProps(nextProps) {
    //     this.setState({
    //         target: null,
    //         originalPos: null
    //     })
    // }

    handleEnter (e) {
        if ( e.target.classList.contains('thingy') ) {
            this.setState({
                target: parseInt(e.target.dataset.position)
            })
        } else if ( e.target.classList.contains('idk') ) {
            this.setState({
                target: -1
            })
        }
    }

    handleLeave (e) {
        if ( e.target.classList.contains('idk') && this.state.target === -1 ) {
            this.setState({target: null})
        }
    }

    handleDragover (e) {
        e.preventDefault()
        e.stopPropagation()
        e.dataTransfer.dropEffect = 'copy'
    }

    handleDrop (e) {
        const state = Object.assign({}, this.state)
        if ( state.originalPos !== null )
            this.props.moveTrackToIndex( this.props.channel, state.originalPos, state.target )
        else
            this.props.addTrackAtIndex( this.props.channel, state.target, parseInt(e.dataTransfer.getData('trackId')) )
    }

    confirmDrag (track) {
        if ( this.state.target === null )
            this.props.removeTrackAtIndex(this.props.channel, this.state.originalPos)

        this.setState({
            target: null,
            originalPos: null
        })
    }

    render () {
        const tracks = this.props.tracks
        return (
            <div
                className="idk"
                ref={ e => this.rowElement = e }
            >
                {tracks.map( (t, i) =>
                    <Track
                        key={i}
                        confirmDrag={this.confirmDrag}
                        setOriginalPosition={ () => this.setState({originalPos: i}) }
                        position={i}
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
        e.dataTransfer.setData('trackId', this.props.track.id)
        setTimeout(
            () => {
                this.setState({imBeingDragged: true})
                this.props.setOriginalPosition()
            },
            1
        )
    }

    handleDragEnd (e) {
        this.setState({imBeingDragged: false})
        this.props.confirmDrag(this.props.track)
    }

    render () {
        const track = this.props.track
        return (
            <span
                ref={ e => this.element = e }
                data-position={ this.props.position }
                className={`thingy ${this.state.imBeingDragged ? 'beingdragged' : ''}`}
                style={{width: track.ticks*2, backgroundColor: track.color}}
            >
            </span>
        )
    }
}
