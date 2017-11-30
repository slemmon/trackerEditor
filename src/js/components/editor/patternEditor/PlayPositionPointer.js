import React, { Component } from 'react'

class PlayPositionPointer extends Component {

    constructor() {
        super()

        this.updatePosition = this.updatePosition.bind(this)
        this.prepareElements = this.prepareElements.bind(this)

    }

    componentDidMount() {
        document.addEventListener('playPosition', this.updatePosition)
    }

    componentWillUnmount() {
        document.removeEventListener('playPosition', this.updatePosition)
    }

    componentDidUpdate(prevProps, prevState) {
        this.prepareElements(this.el)
    }

    updatePosition (e) {
        const ticks = e.detail.ticks,
              repeatIsOn = this.props.repeatIsOn

        if ( ticks <= this.props.ticks ) {
            const newPosition = this.parentHeight - ( ticks * this.tickStep )
            this.el.style.top = `${newPosition}px`
            this.scrollable.scrollTop = newPosition - 40
        } else if ( repeatIsOn ) {
            const newPosition = this.parentHeight - ( ( ticks * this.tickStep ) % this.parentHeight )
            this.el.style.top = `${newPosition}px`
            this.scrollable.scrollTop = newPosition - 40
        }
    }

    prepareElements (el) {
        if ( !el ) return
        this.el = el
        const parentHeight = document.getElementsByClassName('editor-table')[0].clientHeight
        this.parentHeight = parentHeight
        this.el.style.top = `${parentHeight}px`
        this.tickStep = parentHeight / this.props.ticks

        this.scrollable = document.getElementsByClassName('editor-table-container')[0]
    }

    // testdrag (e) {
    //     console.log(e)
    //     const dragIcon = document.createElement('div')
    //     // dragIcon.src = 'http://jsfiddle.net/favicon.png'
    //     // dragIcon.style.width = '100px'
    //     // dragIcon.style.height = '100px'
    //     // dragIcon.style.backgroundColor = 'red'
    //     document.body.appendChild(dragIcon)
    //     e.dataTransfer.setDragImage(dragIcon, -10, -10);
    // }

    render () {
        return (
            <span
                className="play-position"
                ref={ this.prepareElements }
            >
                <span className="play-position-caret"><i className="fa fa-angle-right" aria-hidden="true"></i></span>
                <span className="play-position-line"></span>
            </span>
        )
    }
}

export default PlayPositionPointer
