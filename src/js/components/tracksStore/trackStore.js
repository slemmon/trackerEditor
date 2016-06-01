import React, {Component} from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import TrackerTable from '../trackerTable/trackerTable.jsx';
import {List, ListItem} from 'material-ui/List';
import EmptyLabel from 'material-ui/svg-icons/action/label-outline'
import Label from 'material-ui/svg-icons/action/label'

export default class TrackStore extends Component{
	constructor (props) {
		super(props);
		this.state = {
			tracksList: [{
				selected:true,
				ticks:64,
				track:Array.apply(null, Array(64)).map(function (x, i) { return null; }),
				trackName : '#',
				ATM: []
			}]
		}
		this.addTrack = this.addTrack.bind(this);
		this.selectedTrack = this.selectedTrack.bind(this);
		this.selectTrack = this.selectTrack.bind(this);
		this.setSelectedTrack = this.setSelectedTrack.bind(this);
	}
	addTrack () {
		let tracksList = this.state.tracksList.slice();
		tracksList = tracksList.map((track) => {
			track.selected = false;
			return track
		})
		tracksList.push({
			selected:true,
			ticks:64,
			track:Array.apply(null, Array(64)).map(function (x, i) { return null; }),
			trackName : '#',
			ATM: []
		})
		this.setState({
			tracksList: tracksList
		})
	}
	selectTrack (position) {
		let tracksList = this.state.tracksList.slice();
		tracksList = tracksList.map((track) => {
			track.selected = false;
			return track
		})
		tracksList[position].selected = true;
		this.setState({
			tracksList: tracksList
		})
	}
	selectedTrack () {
		return this.state.tracksList.find((track) => {
			return track.selected === true
		})
	}
	setSelectedTrack(obj) {
		let tracksList = this.state.tracksList.slice();
		tracksList = tracksList.map((track) => {
			if (track.selected) {
				for (var attrname in obj) { 
					track[attrname] = obj[attrname]; 
				}
			}
			return track
		})

		this.setState({
			tracksList: tracksList
		})
	}
	render () {
		const state = this.state
		return (
			<div>
				<h2>Tracks List</h2>
				<RaisedButton label="New Track" primary={true} onClick={this.addTrack}/>
				<List>
					{state.tracksList.map((track, i) => {
						const select = track.selected? <Label/>:<EmptyLabel/>;
						return <ListItem leftIcon={select} key={i} primaryText ={track.trackName + ' ('+ track.ticks+')'} onClick={this.selectTrack.bind(this,i)} />
					})}
				</List>
				<TrackerTable setSelectedTrack={this.setSelectedTrack} selectedTrack={this.selectedTrack()}/>
			</div>
		)
	}
}