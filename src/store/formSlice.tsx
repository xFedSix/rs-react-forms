import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface FormData {
  name: string;
  age: number;
  email: string;
  password: string;
  confirmPassword: string;
  gender: string;
  avatar: string;
  country: string;
  agreement: boolean;
}

interface FormState {
  uncontrolledFormData: FormData[] | null;
  hookFormData: FormData[] | null;
}

const initialState: FormState = {
  uncontrolledFormData: null,
  hookFormData: null
};

const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    setUncontrolledFormData: (state, action: PayloadAction<FormData>) => {
      if (state.uncontrolledFormData === null) {
        state.uncontrolledFormData = [];
      }
      state.uncontrolledFormData.unshift(action.payload);
    },
    setHookFormData: (state, action: PayloadAction<FormData>) => {
      if (state.hookFormData === null) {
        state.hookFormData = [];
      }
      state.hookFormData.unshift(action.payload);
    }
  }
});

export const { setUncontrolledFormData, setHookFormData } = formSlice.actions;

export default formSlice.reducer;
