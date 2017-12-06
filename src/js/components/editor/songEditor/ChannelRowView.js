import React, { Component } from 'react'
import Pattern from './Pattern'

class ChannelRowView extends Component {
    state = {
        isDropTarget: false
    }

    iAmTheDrumChannel = (this.props.channel === 3)

    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.status === 0
    }

    /**
     * Check that the pattern and target channel rows are of the same type
     * @return {Boolean} True if the type of pattern being dragged matches the
     * type of row its being dragged over
     */
    isDragMatch = () => {
        const { type } = this.props.dragSource
        const { iAmTheDrumChannel } = this
        return (type === 'drum' && iAmTheDrumChannel) ||
               (type !== 'drum' && !iAmTheDrumChannel)
    }

    /**
     * Determines whether the dragged pattern is eligible to be dropped at the
     * current cursor location.  Additionally, if the dragged pattern is being
     * inserted amongst other patterns an indicator will he shown to tell the
     * user where the pattern will reside if dropped
     * @param {Event} e The drag event
     */
    handleDragover = (e) => {
        const { target } = e
        const match = this.isDragMatch()
        
        // if the pattern and channel type match allow the drop
        if (match) {
            e.preventDefault()

            // if the pattern is currently over another pattern show an
            // indicator to tell where the pattern will land if dropped
            if (target.classList.contains('draggable')) {
                const { left, top } = target.getBoundingClientRect()
                const xPos = left
                const { color } = this.props.dragSource
                this.props.showDropIndicator({
                    color: color.hex,
                    x: xPos,
                    y: top
                });
            } else {
                // otherwise we'll just decorate the whole row itself
                if (match) {
                    this.setState({
                        isDropTarget: true
                    })
                }
                // and hide the insert-pattern indicator
                this.props.hideDropIndicator();
            }
        }
    }

    /**
     * Remove the decoration on the channel row as the cursor exits
     * @param {Event} e The drag event
     */
    handleDragLeave = (e) => {
        this.setState({
            isDropTarget: false
        })
    }

    /**
     * Handle the moving / copying of the dropped pattern
     * @param {Event} e The drag event
     */
    handleDrop = (e) => {
        const doCopy = e.metaKey
        
        // hide the insert-pattern indicator and un-decorate the channel row
        this.props.hideDropIndicator();
        this.setState({
            isDropTarget: false
        })

        // if the dragged pattern doesn't already belong to a channel row in the
        // song editor or the Ctrl / Option key as held while dragging within a
        // channel row then copy a pattern in place.  Else move an existing
        // pattern within / between channels
        const editorId = e.dataTransfer.getData('editorId')
        const { channel, patterns } = this.props
        if ( !editorId || doCopy )
            //add
            this.props.addPatternAtIndex(
                channel,
                patterns.find(
                    t => t.id === parseInt(
                        e.dataTransfer.getData('patternId')
                    )
                ),
                parseInt(e.target.dataset.position || -1)
            )
        else
            //move
            this.props.movePatternToIndex(
                channel,
                parseInt(e.dataTransfer.getData('channel')),
                parseInt(editorId),
                parseInt(e.target.dataset.position || -1)
            )
    }

    render () {
        const props = this.props
        const { channel, channelPatterns, editingFx, fx,
              fxStatus, openFx, patterns, removePattern, tick = 0 } = props
        const { isDropTarget } = this.state
        const activeFx = fxStatus.fxType === 'pattern' && fxStatus.id
        const playIndicatorCtStyle = {
            display: 'inline-flex',
            padding: '4px 0',
            position: 'relative'
        }
        const playIndicatorStyle = {
            position: 'absolute',
            left: 0,
            bottom: 0,
            height: 3,
            background: '#00969b',
            width: channelPatterns.length ? tick * 2 : 0
        }
        const patternStyle = {
            backgroundColor: isDropTarget ? '#d5ecec' : 'transparent'
        }
        const editingFxCls = editingFx ? ' active' : ''
        
        return (
            <div
                onDragLeave = { this.handleDragLeave }
                onDragOver = { this.handleDragover }
                onDrop = { this.handleDrop }
                className = {`channel-pattern droppable${editingFxCls}`}
                style = {patternStyle}
            >
                <div style={playIndicatorCtStyle}>
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
                    <div style={playIndicatorStyle}></div>
                </div>
            </div>
        )
    }
}

export default ChannelRowView
