import React, { Component } from 'react'
import Pattern from './Pattern'

class ChannelRowView extends Component {
    constructor (props) {
        super()

        this.handleDrop = this.handleDrop.bind(this)
        this.handleDragover = this.handleDragover.bind(this)

        this.iAmTheDrumChannel = props.channel === 3
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.status === 0
    }

    handleDragover (e) {
        e.preventDefault()
    }

    handleDrop (e) {
        if ( this.iAmTheDrumChannel !== (e.dataTransfer.getData('type') === 'drum') ) return

        const editorId = e.dataTransfer.getData('editorId')
        if ( editorId )
            //move
            this.props.movePatternToIndex( this.props.channel, parseInt(e.dataTransfer.getData('channel')), parseInt(editorId), parseInt(e.target.dataset.position||-1) )
        else
            //add
            this.props.addPatternAtIndex( this.props.channel, this.props.patterns.find(t => t.id === parseInt(e.dataTransfer.getData('patternId'))), parseInt(e.target.dataset.position||-1) )
    }

    render () {
        const props = this.props
        const channelPatterns = props.channelPatterns
        const patterns = props.patterns
        const fxStatus = props.fxStatus
        const activeFx = fxStatus.fxType === 'pattern' && fxStatus.id
        const fx = props.fx
        return (
            <div
                onDragOver = { this.handleDragover }
                onDrop = { this.handleDrop }
                className = {`channel-pattern droppable ${ props.editingFx ? 'active' : '' }`}
            >
                {channelPatterns.map( (pattern, i) => {
                    const { editorId, id } = pattern
                    const patternFx = fx.pattern[editorId]
                    const appliedFx = (patternFx && patternFx.fx) || {}

                    return (
                        <Pattern
                            key = {editorId}
                            position = {i}
                            pattern = {pattern}
                            detail = {patterns.find( t => t.id === id )}
                            removePattern = {props.removePattern}
                            channel = {props.channel}
                            openFx = {props.openFx}
                            activeFx = {activeFx === editorId}
                            appliedFx = {appliedFx}
                        />
                    )
                }
                )}
            </div>
        )
    }
}

export default ChannelRowView
