import React, { Component } from 'react'
import stringifyColor from '../../../stringifyColor'

class ListOfTracks extends Component {
    constructor (props) {
        super()

        this.state = {
            target: null,
            originalPos: null
        }

        this.handleEnter = this.handleEnter.bind(this)
        this.handleLeave = this.handleLeave.bind(this)
        this.confirmDrag = this.confirmDrag.bind(this)
        this.handleDrop = this.handleDrop.bind(this)

        this.iAmTheDrumChannel = props.channel === 3
    }

    handleEnter (e) {
        if ( e.target.classList.contains('draggable') ) {
            this.setState({
                target: parseInt(e.target.dataset.position)
            })
        } else if ( e.target.classList.contains('droppable') ) {
            this.setState({
                target: -1
            })
        }
    }

    handleLeave (e) {
        if ( e.target.classList.contains('droppable') && this.state.target === -1 ) {
            this.setState({target: null})
        }
    }

    handleDragover (e) {
        e.preventDefault()
        e.stopPropagation()
        e.dataTransfer.dropEffect = 'copy'
    }

    handleDrop (e) {
        if ( this.iAmTheDrumChannel !== (e.dataTransfer.getData('type') === 'drum') ) return

        const state = this.state
        if ( state.originalPos !== null ) {
            this.props.moveTrackToIndex( this.props.channel, state.originalPos, state.target )
        }
        else {
            this.props.addTrackAtIndex( this.props.channel, state.target, parseInt(e.dataTransfer.getData('trackId')) )
        }
    }

    confirmDrag (track) {
        if ( this.state.target === null ) {
            this.props.removeTrackAtIndex(this.props.channel, this.state.originalPos)
        }

        this.setState({
            target: null,
            originalPos: null
        })
    }

    render () {
        const tracks = this.props.tracks
        return (
            <div
                onDragLeave = { this.handleLeave }
                onDragEnter = { this.handleEnter }
                onDragOver = { this.handleDragover }
                onDrop = { this.handleDrop }
                className = "droppable"
            >
                {tracks.map( (t, i) =>
                    <Track
                        key = {i}
                        confirmDrag = {this.confirmDrag}
                        setOriginalPosition = { () => this.setState({originalPos: i, target: null}) }
                        position = {i}
                        track = {t}
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

    handleDragStart (e) {
        e.dataTransfer.setData('trackId', this.props.track.id)
        e.dataTransfer.setData('type', this.props.track.type)
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
                draggable = { true }
                onDragStart = { this.handleDragStart }
                onDragEnd = { this.handleDragEnd }
                data-position = { this.props.position }
                className = { `draggable ${track.type === 'tune' ? 'draggable-tune' : 'draggable-drum' } ${this.state.imBeingDragged ? 'beingdragged' : ''}` }
                style = { {width: track.ticks*2, backgroundColor: stringifyColor(track.color, 'rgba', {a: 0.5}), borderColor: stringifyColor(track.color, 'rgb')} }
            >
            </span>
        )
    }
}
