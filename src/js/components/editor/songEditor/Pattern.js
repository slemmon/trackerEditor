import React, { Component } from 'react'
import stringifyColor from '../../../stringifyColor'
import color from 'color'

class Pattern extends Component {
    constructor () {
        super()

        this.state = {
            imBeingDragged: false
        }

        this.handleDragStart = this.handleDragStart.bind(this)
        this.handleDrop = this.handleDrop.bind(this)
        this.openFx = this.openFx.bind(this)
    }

    componentWillUnmount () {
        window.removeEventListener('drop', this.handleDrop)
        window.removeEventListener('dragover', this.handleDragOver)
    }

    handleDragStart (e) {
        window.addEventListener('drop', this.handleDrop)
        window.addEventListener('dragover', this.handleDragOver)

        e.dataTransfer.setData('patternId', this.props.pattern.id)
        e.dataTransfer.setData('type', this.props.pattern.type)
        e.dataTransfer.setData('editorId', this.props.pattern.editorId)
        e.dataTransfer.setData('channel', this.props.channel)
        setTimeout(
            () => {
                this.setState({
                    imBeingDragged: true
                })
            },
            1
        )
    }

    handleDragOver (e) {
        e.preventDefault()
    }

    handleDrop (e) {
        if ( !e.target.closest('.channel-pattern.droppable') )
        // if ( !e.target.classList.contains('channel-pattern') || !e.target.classList.contains('droppable') )
            return this.props.removePattern(this.props.channel, this.props.pattern.editorId)

        this.setState({
            imBeingDragged: false
        })

        window.removeEventListener('drop', this.handleDrop)
        window.removeEventListener('dragover', this.handleDragOver)
    }

    openFx () {
        this.props.openFx(this.props.pattern.editorId)
    }

    render () {
        const { appliedFx, detail, position, pattern } = this.props
        const rgbObj = color(detail.color.hex).rgb()
        const colorLight = rgbObj.fade(.5)
        const colorDark = rgbObj.string()
        const fxCount = Object.keys(appliedFx).length
        const style = {
            padding: '0 4px',
            width: detail.ticks*2,
            backgroundColor: colorLight,
            borderColor: colorDark,
            color: colorDark
        }
        
        return (
            <span
                draggable = { true }
                onDoubleClick = {this.openFx}
                onDragStart = { this.handleDragStart }
                data-position = { position }
                className = { `draggable ${pattern.type === 'tune' ? 'draggable-tune' : 'draggable-drum' } ${this.state.imBeingDragged ? 'beingdragged' : ''} ${this.props.activeFx ? 'active' : ''}` }
                style = {style}
            >
                {fxCount > 0 && <span>{fxCount}</span>}
            </span>
        )
    }
}

export default Pattern
