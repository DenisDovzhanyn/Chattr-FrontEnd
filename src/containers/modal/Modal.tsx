import { color } from 'motion/react'
import './Modal.css'
import { useState, useRef, useEffect } from 'react'

interface ModalProps {
    openState: boolean,
    setOpenState: CallableFunction,
    handleSubmit: CallableFunction,
    inputLabel: string,
    buttonLabel: string,
    closeOnSubmit: boolean,
    error: string
}
function Modal(props: ModalProps) {
    const [inputState, setInputState] = useState('')
    const inputRef = useRef<HTMLInputElement>(null)



    useEffect(() => {
            if (props.openState && inputRef.current) {
              inputRef.current.focus();
              inputRef.current.select();
            }
          }, [props.openState]);

    return (
        <>
            <div id='modalbackground' style={{display: props.openState ? 'block' : 'none'}} />
            <dialog open={props.openState} id='createchatmodal'>
                <button onClick={() => (props.setOpenState(false))} id='modalexitbutton'>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" id='exitsvg'>
                        <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/>
                    </svg>
                </button>

                <label id='createchatlabel'>
                    {props.inputLabel}
                    <input onChange={(e) => setInputState(e.target.value)} 
                        className='input'
                        id='chatnameinput'
                        type='text' 
                        value={inputState}
                        ref={inputRef}
                        required
                    />
                </label>
                {props.error? <div style={ {backgroundColor: 'transparent', color: '#d35a5a', width: '100%'}}> {props.error}</div> : ''}
                <button id='modalbutton' disabled = {inputState ? false : true} onClick={(event) => {
                    event.preventDefault()
                    props.handleSubmit(inputState)
                    if (props.closeOnSubmit) props.setOpenState(false)
                    setInputState('')
                }}>
                    {props.buttonLabel}
                </button>


            </dialog>
        </>
    )
}

export default Modal