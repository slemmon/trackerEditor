import React, { Component } from 'react'
import { Manager, Target, Popper, Arrow } from 'react-popper'

/**
 * The ConfirmDelete class displays a delete / trashcan icon that when clicked
 * shows a confirmation popup.  Clicking outside the popup closes it.  Clicking
 * the confirmation button closes it and calls the onConfirmClick prop.
 */
class ConfirmDelete extends Component {
    /**
     * When the dialog is shown we add a click handler on the document to call
     * the hide prop function.  When it is hidden we remove the click handler.
     * @param {Boolean} show True when the dialog is to be shown
     * @param {Function} hide The method used to hide the dialog
     */
    componentWillReceiveProps ({ show, hide }) {
        if (show) {
            document.addEventListener('click', hide)
        } else {
            document.removeEventListener('click', hide)
        }
    }

    /**
     * When the dialog is unmounted we'll remove the document click listener
     * that hides the dialog
     */
    componentWillUnmount () {
        document.removeEventListener('click', this.props.hide)
    }

    /**
     * Prevent the popper from hiding if its body is what's clicked on
     * @param {Event} e The (synthetic) click event
     */
    onPopperClick (e) {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
    }

    render () {
        // onTargetClick is the method that ultimately shows the dialog
        // onConfirmClick is the action taken when the dialog is confirmed
        const { show, onTargetClick, onConfirmClick } = this.props;

        return (
            <Manager>
                <Target
                    children={
                        <span onClick={onTargetClick}>
                            <i className="fa fa-trash-o" aria-hidden="true"></i>
                        </span>
                    }
                />
                {show && (
                    <Popper
                        placement="top"
                        className="popper"
                        onClick={this.onPopperClick}
                    >
                        Are you sure?<br />
                        <button onClick={ onConfirmClick }>Yes, Delete!</button>
                        <Arrow className="popper__arrow"/>
                    </Popper>
                )}
            </Manager>
        )
    }
}

export default ConfirmDelete