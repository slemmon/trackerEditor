import React, { Component } from 'react'
import stringifyColor from '../../../stringifyColor'
import color from 'color'

class Pattern extends Component {
    state = {
        copyPattern: false,
        imBeingDragged: false,
        willDelete: false
    }

    /**
     * Remove the global drag / drop event listeners
     */
    componentWillUnmount () {
        document.removeEventListener('drop', this.handleDrop)
        document.removeEventListener('dragover', this.handleDragOver)
    }

    /**
     * Decorates the source pattern being moved / copied
     * @param {Boolean} doCopy Whether the pattern is to be copied or moved
     */
    decorateDragSource = (doCopy) => {
        // DEV NOTE: The state change is done on a timeout since the browser
        // needs just a second to create the proxy image from the pattern first
        setTimeout(
            () => {
                this.setState({
                    imBeingDragged: true,
                    copyPattern: doCopy
                })
            },
            1
        )
    }

    /**
     * Handle the dragging of a pattern element withing the song editor channel
     * rows.  Hold down Ctrl / Command (on Mac) to copy the pattern instead of
     * moving it
     * @param {Event} e The drag event
     */
    handleDragStart = (e) => {
        const { channel, pattern } = this.props
        const { editorId, id, type } = pattern

        // add data to the drag event used by the drop handler
        e.dataTransfer.setData('patternId', id)
        e.dataTransfer.setData('type', type)
        e.dataTransfer.setData('editorId', editorId)
        e.dataTransfer.setData('channel', channel)
        
        // add global drag event handlers
        // used to see if the drag operation is outside of the song editor's
        // channel rows and if so, delete the pattern
        document.addEventListener('drop', this.handleDrop)
        document.addEventListener('dragover', this.handleDragOver)

        // decorate the source pattern being dragged
        this.decorateDragSource(e.metaKey)
    }

    /**
     * Returns whether the current location of the cursor will accept a pattern
     * drop
     * @param {Event} e The drag event
     * @return {Boolean} True if the current / ancestor element under the cursor
     * may accept a pattern drop
     */
    isDropZone (e) {
        const { target } = e

        return !!target.closest('.channel-pattern.droppable')
    }

    /**
     * Handles showing whether the dragged pattern is droppable or not as well
     * as showing that it will be deleted on drop if dragged outside the song
     * editor
     * @param {Event} e The drag event
     */
    handleDragOver = (e) => {
        const { target } = e
        const dropZone = this.isDropZone(e)
        const effect = dropZone ? 'move' : 'link'
        
        // if the cursor is over the document (outside of the channel rows of
        // the song editor) then allow the drop action to be handled
        if (!dropZone) {
            e.preventDefault()
        }

        // decorate the source pattern showing that a drop will delete it
        this.setState({
            willDelete: !dropZone
        })
        // decorate the cursor when outside of the song editor
        e.dataTransfer.effectAllowed = effect
        e.dataTransfer.dropEffect = effect
    }

    /**
     * Handles moving or copying the dragged pattern
     * @param {Event} e The drag event
     */
    handleDrop = (e) => {
        // restore the pattern view to its "un-dragged" state
        this.setState({
            imBeingDragged: false,
            copyPattern: false,
            willDelete: false
        })
        // remove the global drag event handlers
        document.removeEventListener('drop', this.handleDrop)
        document.removeEventListener('dragover', this.handleDragOver)

        // if the drop happened outside of the song editor remove the pattern
        if ( !this.isDropZone(e) ) {
            const { channel, pattern } = this.props

            this.props.removePattern(channel, pattern.editorId)
        }
    }

    /**
     * Opens the effects editor for the current pattern
     */
    openFx = () => {
        this.props.openFx(this.props.pattern.editorId)
    }

    render () {
        const { activeFx, appliedFx, detail, position, pattern } = this.props
        const { type } = pattern
        const { copyPattern, imBeingDragged, willDelete } = this.state
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

        const draggableCls = `draggable-${type}`
        const beingDraggedCls = imBeingDragged ? ' beingdragged' : ''
        const activeFxCls = activeFx ? ' active' : ''
        const deleteCls = willDelete ? ' will-delete' : ''
        const copyCls = copyPattern ? ' copy-pattern' : ''
        const cls = `draggable ${draggableCls}${beingDraggedCls}` +
              `${activeFxCls}${deleteCls}${copyCls}`
        
        return (
            <span
                draggable = { true }
                onDoubleClick = {this.openFx}
                onDragStart = { this.handleDragStart }
                data-position = { position }
                className = { cls }
                style = {style}
            >
                {fxCount > 0 && <span>{fxCount}</span>}
            </span>
        )
    }
}

export default Pattern
