import { createSlice } from "@reduxjs/toolkit";

interface isLoadingState {
    value: boolean
}

const initialState: isLoadingState = {
    value: false
}
export const isLoadingSlice = createSlice({
    name: 'isLoading',
    initialState,
    reducers: {
        setIsLoading: (state, action) => {
            state.value = action.payload
        }
    }
})

export const { setIsLoading } = isLoadingSlice.actions
export default isLoadingSlice.reducer