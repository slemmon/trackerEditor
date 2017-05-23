import { connect } from 'react-redux'
import FxEditorManagerView from './FxEditorManagerView'

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
        },
        initFx (id) {
            dispatch({
                type: "FX_INIT_TRACK_FX",
                id
            })
        }
    }
}

const FxEditorManager = connect(
    mapStateToProps,
    mapDispatchToProps
)(FxEditorManagerView)

export default FxEditorManager
