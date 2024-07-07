import { configureStore, combineSlices } from "@reduxjs/toolkit";
import type { Action, ThunkAction } from "@reduxjs/toolkit";
import { custodianApiSlice } from "./features/custodians/custodianApiSlice";
import { evidenceApiSlice } from "./features/evidence/evidenceApiSlice";
import { authsApiSlice } from "./features/auths/authsApiSlice";

// Combine slices using combineSlices function
const rootReducer = combineSlices(
  custodianApiSlice,
  evidenceApiSlice,
  authsApiSlice
  // Add more slices as needed
);

export const makeStore = () => {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => {
      return getDefaultMiddleware().concat(
        custodianApiSlice.middleware,
        evidenceApiSlice.middleware,
        authsApiSlice.middleware
      );
    },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
export type AppThunk<ThunkReturnType = void> = ThunkAction<
  ThunkReturnType,
  RootState,
  unknown,
  Action
>;
