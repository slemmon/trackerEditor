import React, { Component } from 'react'

class Pointer extends Component {

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
            const newPosition = ticks * this.tickStep
            this.el.style.left = `${newPosition}px`
            this.scrollable.scrollLeft = newPosition - 400
        } else if ( repeatIsOn ) {
            const newPosition = ( ticks * this.tickStep ) % this.parentWidth
            this.el.style.left = `${newPosition}px`
            this.scrollable.scrollLeft = newPosition - 400
        }
    }

    prepareElements (el) {
        if ( !el ) return
        this.el = el
        const parent = document.getElementsByClassName('editor-drum-row')[0]
        const parentWidth = parent.clientWidth
        this.parentWidth = parentWidth
        this.tickStep = parentWidth / this.props.ticks

        this.scrollable = document.getElementsByClassName('editor-drum-container')[0]
    }

    render () {
        return (
            <span
                className="play-position-drum"
                ref={ this.prepareElements }
            >
                <span className="play-position-drum-caret"><i className="fa fa-angle-down" aria-hidden="true"></i></span>
            </span>
        )
    }
}

export default Pointer
