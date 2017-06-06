import React, { Component } from 'react'

const NoteSheet = () =>
    <div className="sheet-note-container">
        {/*<div className="sheet-note-row">
            <span className="sheet-note sheet-note-low">C4</span>
            <span className="sheet-note sheet-note-high">
                  <span>C#</span>
                  <span className="sheet-note-key-black"></span>
            </span>
            <span className="sheet-note sheet-note-low">D4</span>
            <span className="sheet-note sheet-note-high">
                  <span>D#</span>
                  <span className="sheet-note-key-black"></span>
            </span>
            <span className="sheet-note sheet-note-low">E4</span>
            <span className="sheet-note sheet-note-low">F4</span>
            <span className="sheet-note sheet-note-high">
                  <span>F#</span>
                  <span className="sheet-note-key-black"></span>
            </span>
            <span className="sheet-note sheet-note-low">G4</span>
            <span className="sheet-note sheet-note-high">
                  <span>G#</span>
                  <span className="sheet-note-key-black"></span>
            </span>
            <span className="sheet-note sheet-note-low">A4</span>
            <span className="sheet-note sheet-note-high">
                  <span>A#</span>
                  <span className="sheet-note-key-black"></span>
            </span>
            <span className="sheet-note sheet-note-low">B4</span>
            <span className="sheet-note sheet-note-low">C5</span>
            <span className="sheet-note sheet-note-high">
                  <span>C#</span>
                  <span className="sheet-note-key-black"></span>
            </span>
            <span className="sheet-note sheet-note-low">D5</span>
            <span className="sheet-note sheet-note-high">
                  <span>D#</span>
                  <span className="sheet-note-key-black"></span>
            </span>
            <span className="sheet-note sheet-note-low">E5</span>
            <span className="sheet-note sheet-note-low">F5</span>
            <span className="sheet-note sheet-note-high">
                  <span>F#</span>
                  <span className="sheet-note-key-black"></span>
            </span>
            <span className="sheet-note sheet-note-low">G5</span>
            <span className="sheet-note sheet-note-high">
                  <span>G#</span>
                  <span className="sheet-note-key-black"></span>
            </span>
            <span className="sheet-note sheet-note-low">A5</span>
            <span className="sheet-note sheet-note-high">
                  <span>A#</span>
                  <span className="sheet-note-key-black"></span>
            </span>
            <span className="sheet-note sheet-note-low">B5</span>
            <span className="sheet-note sheet-note-low">C6</span>
            <span className="sheet-note sheet-note-high">
                  <span>C#</span>
                  <span className="sheet-note-key-black"></span>
            </span>
            <span className="sheet-note sheet-note-low">D6</span>
            <span className="sheet-note sheet-note-high">
                  <span>D#</span>
                  <span className="sheet-note-key-black"></span>
            </span>
            <span className="sheet-note sheet-note-low">E6</span>
            <span className="sheet-note sheet-note-low">F6</span>
            <span className="sheet-note sheet-note-high">
                  <span>F#</span>
                  <span className="sheet-note-key-black"></span>
            </span>
            <span className="sheet-note sheet-note-low">G6</span>
            <span className="sheet-note sheet-note-high">
                  <span>G#</span>
                  <span className="sheet-note-key-black"></span>
            </span>
            <span className="sheet-note sheet-note-low">A6</span>
            <span className="sheet-note sheet-note-high">
                  <span>A#</span>
                  <span className="sheet-note-key-black"></span>
            </span>
            <span className="sheet-note sheet-note-low">B6</span>
            <span className="sheet-note sheet-note-low">C7</span>
            <span className="sheet-note sheet-note-high">
                  <span>C#</span>
                  <span className="sheet-note-key-black"></span>
            </span>
            <span className="sheet-note sheet-note-low">D7</span>
            <span className="sheet-note sheet-note-high">
                  <span>D#</span>
                  <span className="sheet-note-key-black"></span>
            </span>
            <span className="sheet-note sheet-note-low">E7</span>
            <span className="sheet-note sheet-note-low">F7</span>
            <span className="sheet-note sheet-note-high">
                  <span>F#</span>
                  <span className="sheet-note-key-black"></span>
            </span>
            <span className="sheet-note sheet-note-low">G7</span>
            <span className="sheet-note sheet-note-high">
                  <span>G#</span>
                  <span className="sheet-note-key-black"></span>
            </span>
            <span className="sheet-note sheet-note-low">A7</span>
            <span className="sheet-note sheet-note-high">
                  <span>A#</span>
                  <span className="sheet-note-key-black"></span>
            </span>
            <span className="sheet-note sheet-note-low">B7</span>
            <span className="sheet-note sheet-note-low">C8</span>
            <span className="sheet-note sheet-note-high">
                  <span>C#</span>
                  <span className="sheet-note-key-black"></span>
            </span>
            <span className="sheet-note sheet-note-low">D8</span>
            <span className="sheet-note sheet-note-high">
                  <span>D#</span>
                  <span className="sheet-note-key-black"></span>
            </span>
            <span className="sheet-note sheet-note-low">E8</span>
            <span className="sheet-note sheet-note-low">F8</span>
            <span className="sheet-note sheet-note-high">
                  <span>F#</span>
                  <span className="sheet-note-key-black"></span>
            </span>
            <span className="sheet-note sheet-note-low">G8</span>
            <span className="sheet-note sheet-note-high">
                  <span>G#</span>
                  <span className="sheet-note-key-black"></span>
            </span>
            <span className="sheet-note sheet-note-low">A8</span>
            <span className="sheet-note sheet-note-high">
                  <span>A#</span>
                  <span className="sheet-note-key-black"></span>
            </span>
            <span className="sheet-note sheet-note-low">B8</span>
            <span className="sheet-note sheet-note-low">C9</span>
            <span className="sheet-note sheet-note-high">
                  <span>C#</span>
                  <span className="sheet-note-key-black"></span>
            </span>
            <span className="sheet-note sheet-note-low">D9</span>
        </div>
        <div className="sheet-note-key-row">
            <span className="sheet-note-key key-1">
            </span>
            <span className="sheet-note-key key-2">
            </span>
            <span className="sheet-note-key key-3">
            </span>
            <span className="sheet-note-key key-4">
            </span>
            <span className="sheet-note-key key-5">
            </span>
            <span className="sheet-note-key key-6">
            </span>
            <span className="sheet-note-key key-7">
            </span>
            <span className="sheet-note-key key-1">
            </span>
            <span className="sheet-note-key key-2">
            </span>
            <span className="sheet-note-key key-3">
            </span>
            <span className="sheet-note-key key-4">
            </span>
            <span className="sheet-note-key key-5">
            </span>
            <span className="sheet-note-key key-6">
            </span>
            <span className="sheet-note-key key-7">
            </span>
            <span className="sheet-note-key key-1">
            </span>
            <span className="sheet-note-key key-2">
            </span>
            <span className="sheet-note-key key-3">
            </span>
            <span className="sheet-note-key key-4">
            </span>
            <span className="sheet-note-key key-5">
            </span>
            <span className="sheet-note-key key-6">
            </span>
            <span className="sheet-note-key key-7">
            </span>
            <span className="sheet-note-key key-1">
            </span>
            <span className="sheet-note-key key-2">
            </span>
            <span className="sheet-note-key key-3">
            </span>
            <span className="sheet-note-key key-4">
            </span>
            <span className="sheet-note-key key-5">
            </span>
            <span className="sheet-note-key key-6">
            </span>
            <span className="sheet-note-key key-7">
            </span>
            <span className="sheet-note-key key-1">
            </span>
            <span className="sheet-note-key key-2">
            </span>
            <span className="sheet-note-key key-3">
            </span>
            <span className="sheet-note-key key-4">
            </span>
            <span className="sheet-note-key key-5">
            </span>
            <span className="sheet-note-key key-6">
            </span>
            <span className="sheet-note-key key-7">
            </span>
            <span className="sheet-note-key key-1">
            </span>
            <span className="sheet-note-key key-1">
            </span>
        </div>*/}
        <img src="images/sketch01.png"/>
    </div>

export default NoteSheet
