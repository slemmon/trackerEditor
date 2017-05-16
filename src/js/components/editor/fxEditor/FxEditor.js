import { connect } from 'react-redux'
import FxEditorView from './FxEditorView'

const mapStateToProps = (state) => {
    return {
        fx: state.fx
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        addFx ({fxType, id} = status, fx) {
            dispatch({
                type: "FX_ADD_FX",
                fxType,
                id,
                fx
            })
        },
        removeFx ({fxType, id} = status, fx) {
            dispatch({
                type: "FX_REMOVE_FX",
                fxType,
                id,
                fx
            })
        },
        updateFx ({fxType, id} = status, fx, key, value) {
            dispatch({
                type: "FX_UPDATE_FX",
                fxType,
                id,
                fx,
                key,
                value
            })
        }
    }
}

const FxEditor = connect(
    mapStateToProps,
    mapDispatchToProps
)(FxEditorView)

export default FxEditor
