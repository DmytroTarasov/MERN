import {useCallback, useReducer} from "react";

const formReducer = (state, action) => {
    switch(action.type) {
        case 'INPUT_CHANGE': 
            let formIsValid = true;
            for (const inputId in state.inputs) {
                // if some 'input' property is undefined, just continue (necessary when we are switching a 
                // login modal to a signup modal and therefore changing the fields required to be fulfilled)
                if (!state.inputs[inputId]) {
                    continue;
                }
                if (inputId === action.inputId) {
                    formIsValid = formIsValid && action.isValid;
                } else {
                    formIsValid = formIsValid && state.inputs[inputId].isValid;
                }  
            }
            return {
                ...state,
                inputs: {
                    ...state.inputs,
                    [action.inputId]: {value: action.value, isValid: action.isValid}
                },
                isValid: formIsValid
            }
        case 'SET_DATA':
            return {
                inputs: action.inputs,
                isValid: action.formIsValid
            }
        default: 
            return state;
    }
}

// custom hook
export const useForm = (initialInputs, initialFormValidity) => {
    const [formState, dispatch] = useReducer(formReducer, {

        // stores a validity of individual inputs
        inputs: initialInputs,

        // whether the overall form is valid
        isValid: initialFormValidity 
    });

    // function to check the overall form validity
    const inputHandler = useCallback((id, value, isValid) => {
        dispatch({
            type: 'INPUT_CHANGE', 
            value, 
            isValid, 
            inputId: id
        })
    }, []);

    const setFormData = useCallback((inputData, formValidity) => {
        dispatch({
            type: 'SET_DATA',
            inputs: inputData,
            formIsValid: formValidity
        })
    }, []);

    // return an array so we can consume it inside components
    return [formState, inputHandler, setFormData]; 
}

 