import React, { Component } from 'react'
import Color from './Color'
import stringifyColor from '../../../stringifyColor'
import ConfirmDelete from '../ConfirmDelete'


class PatternRow extends React.Component {
    state = {}

    // shows the delete confirmation dialog
    onDeleteClick = () => {
        this.setState({
            showConfirm: true
        })
    }

    // when the delete dialog is confirmed hide the dialog and delete the
    // pattern
    onConfirmClick = () => {
        this.hideDialog()
        this.props.deletePattern(this.props.pattern.id)
    }

    // hides the delete confirmation dialog
    hideDialog = () => {
        this.setState({
            showConfirm: false
        })
    }

    // adds the selected pattern to the pattern editor view
    onEditClick = (pattern) => {
        this.setState({
            activePattern: pattern.id
        });
        this.props.setActivePattern(pattern)
    }

    /**
     * Handles the dragging of a pattern tickbar element
     * @param {Event} e The drag event
     * @param {*} pattern The pattern being dragged
     */
    onDragStart (e, pattern) {
        const { id, type } = pattern

        // add data to the drag event used by the drop handler
        e.dataTransfer.setData('patternId', id)
        e.dataTransfer.setData('type', type)
        // cache the drag source for other views to reference
        this.props.setDragSource(pattern)
    }

    render () {
        const { showConfirm } = this.state
        const { activePattern, isLast, pattern,
                deletePattern, setPatternColor} = this.props
                
        const { color, id, name, ticks, type } = pattern
        const activated = id === activePattern
        const selectedCls = activated || (isLast && activePattern === null) ?
              ' pattern-list-item-selected' : ''
        const iconCls = `fa fa-${ type === 'tune' ? 'music' : 'superpowers' }`
        const textCls = 'pattern-list-item-text'
        const tickbarCls = `pattern-list-item-tickbar-bar tickbar-tune-${type}`
        const tickbarStyle = {
                  width: ticks * 2,
                  backgroundColor: stringifyColor(color, 'rgba', {a: 0.5}), 
                  borderColor: stringifyColor(color, 'rgb')
              }

        return (
            <li className={`pattern-list-item${selectedCls}`}>
                <span className="pattern-list-item-icon">
                    <i className={iconCls} aria-hidden="true"></i>
                </span>
                <span className={textCls}>{`${name} - (${type})`}</span>
                <span className={textCls}>
                    <span>Ticks: </span><span>{ticks}</span>
                </span>
                <span className="pattern-list-item-tickbar">
                    <span
                        draggable = { true }
                        onDragStart = { e => { this.onDragStart(e, pattern) } }
                        data-pattern-id = { id }
                        className = {tickbarCls}
                        style = {tickbarStyle}
                    ></span>
                </span>
                <span
                    className = "pattern-list-item-buttons"
                >
                    <Color
                        pattern={pattern}
                        setPatternColor={setPatternColor}
                    />
                    <ConfirmDelete
                        onTargetClick={this.onDeleteClick}
                        onConfirmClick={this.onConfirmClick}
                        show={showConfirm}
                        hide={this.hideDialog}
                    />
                    <span onClick={ () => {this.onEditClick(pattern)} }>
                        <i className="fa fa-pencil" aria-hidden="true"></i>
                    </span>
                </span>
            </li>
        )
    }
}

export default PatternRow
