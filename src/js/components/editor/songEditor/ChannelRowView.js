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
        const { channel, channelPatterns, editingFx, fx,
              fxStatus, openFx, patterns, removePattern, tick = 0 } = props
        const activeFx = fxStatus.fxType === 'pattern' && fxStatus.id
        const indicatorCtStyle = {
            display: 'inline-flex',
            padding: '4px 0',
            position: 'relative'
        }
        const indicatorStyle = {
            position: 'absolute',
            left: 0,
            bottom: 0,
            height: 3,
            background: '#00969b',
            width: channelPatterns.length ? tick * 2 : 0
        }
        
        return (
            <div
                onDragOver = { this.handleDragover }
                onDrop = { this.handleDrop }
                className = {`channel-pattern droppable ${ editingFx ? 'active' : '' }`}
            >
                <div style={indicatorCtStyle}>
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
                                removePattern = {removePattern}
                                channel = {channel}
                                openFx = {openFx}
                                activeFx = {activeFx === editorId}
                                appliedFx = {appliedFx}
                            />
                        )
                    }
                    )}
                    <div style={indicatorStyle}></div>
                </div>
            </div>
        )
    }
}

export default ChannelRowView
