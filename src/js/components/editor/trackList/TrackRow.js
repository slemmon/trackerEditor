import React, { Component } from 'react'
import Color from './Color'
import stringifyColor from '../../../stringifyColor'
import ConfirmDelete from '../ConfirmDelete'


class TrackRow extends React.Component {
    state = {}

    // shows the delete confirmation dialog
    onDeleteClick = () => {
        this.setState({
            showConfirm: true
        })
    }

    // when the delete dialog is confirmed hide the dialog and delete the track
    onConfirmClick = () => {
        this.hideDialog()
        this.props.deleteTrack(this.props.track.id)
    }

    // hides the delete confirmation dialog
    hideDialog = () => {
        this.setState({
            showConfirm: false
        })
    }

    // adds the selected track to the track editor view
    onEditClick = (track) => {
        this.setState({
            activeTrack: track.id
        });
        this.props.setActiveTrack(track)
    }

    // handles the dragging of a track tickbar element
    onDragStart (e, id, type) {
        e.dataTransfer.setData('trackId', id)
        e.dataTransfer.setData('type', type)
    }

    render () {
        const { showConfirm } = this.state
        const { activeTrack, isLast, track,
                deleteTrack, setTrackColor} = this.props
                
        const { color, id, name, ticks, type } = track
        const activated = id === activeTrack
        const selectedCls = activated || (isLast && activeTrack === null) ?
              ' track-list-item-selected' : ''
        const iconCls = `fa fa-${ type === 'tune' ? 'music' : 'superpowers' }`
        const textCls = 'track-list-item-text'
        const tickbarCls = `track-list-item-tickbar-bar tickbar-tune-${type}`
        const tickbarStyle = {
                  width: ticks * 2,
                  backgroundColor: stringifyColor(color, 'rgba', {a: 0.5}), 
                  borderColor: stringifyColor(color, 'rgb')
              }

        return (
            <li className={`track-list-item${selectedCls}`}>
                <span className="track-list-item-icon">
                    <i className={iconCls} aria-hidden="true"></i>
                </span>
                <span className={textCls}>{`${name} - (${type})`}</span>
                <span className={textCls}>
                    <span>Ticks: </span><span>{ticks}</span>
                </span>
                <span className="track-list-item-tickbar">
                    <span
                        draggable = { true }
                        onDragStart = { e => { this.onDragStart(e, id, type) } }
                        data-track-id = { id }
                        className = {tickbarCls}
                        style = {tickbarStyle}
                    ></span>
                </span>
                <span
                    className = "track-list-item-buttons"
                >
                    <Color track={track} setTrackColor={ setTrackColor } />
                    <ConfirmDelete
                        onTargetClick={this.onDeleteClick}
                        onConfirmClick={this.onConfirmClick}
                        show={showConfirm}
                        hide={this.hideDialog}
                    />
                    <span onClick={ () => {this.onEditClick(track)} }>
                        <i className="fa fa-pencil" aria-hidden="true"></i>
                    </span>
                </span>
            </li>
        )
    }
}

export default TrackRow
