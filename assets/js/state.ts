export const URLJI_FORM_SUBMITTING = "URLJI_FORM_SUBMITTING";
export const URLJI_FORM_SUBMITTED = "URLJI_FORM_SUBMITTED";
export const URLJI_FORM_ERROR = "URLJI_FORM_ERROR";
export const GO_BACK = "GO_BACK";

interface CreateUrljiResponse {
  original_url: string;
  url: string[];
}

export interface State {
  form?: {
    submitting: boolean;
    error?: string;
  },
  urlji?: CreateUrljiResponse & {
    startTime: number;
  }
}

export type BaseAction<T, P = undefined> = P extends {} ? { type: T, payload: P } : { type: T };
export type UrljiFormSubmitting = BaseAction<typeof URLJI_FORM_SUBMITTING>;
export type UrljiFormSubmitted = BaseAction<typeof URLJI_FORM_SUBMITTED, CreateUrljiResponse>;
export type UrljiFormError = BaseAction<typeof URLJI_FORM_ERROR, { message: string }>;
export type GoBackAction = BaseAction<typeof GO_BACK>;

export type Action =
  | UrljiFormSubmitting
  | UrljiFormSubmitted
  | UrljiFormError
  | GoBackAction;

export type Dispatch = (action: Action) => any;

export const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case URLJI_FORM_SUBMITTING: {
      return {
        ...state,
        form: {
          submitting: true,
        }
      };
    } break;
    case URLJI_FORM_SUBMITTED: {
      return {
        ...state,
        form: {
          submitting: false,
        },
        urlji: {
          ...action.payload,
          startTime: performance.now(),
        }
      };
    } break;
    case URLJI_FORM_ERROR: {
      return {
        ...state,
        form: {
          submitting: false,
          error: action.payload.message,
        }
      };
    } break;
    case GO_BACK: {
      return {};
    } break;
  }
  return state;
};

export interface SubmitUrljiForm {
  method: RequestInit["method"];
  action: string | URL;
  body: RequestInit["body"];
}

export async function submitUrljiForm(dispatch: Dispatch, form: SubmitUrljiForm) {
  dispatch({ type: URLJI_FORM_SUBMITTING });
  try {
    const response = await fetch(form.action, {
      method: form.method,
      body: form.body,
    });
    if (!response.ok) {
      if (response.status === 400) {
        const payload = await response.json();
        dispatch({
          type: URLJI_FORM_ERROR, payload: {
            message: Object.entries(payload.errors as Record<string, string[]>).map(entry => `${entry[0]}: ${entry[1].join(", ")}`).join(", ")
          }
        });
      } else {
        throw new Error("Something went wrong");
      }
      return;
    }
    const payload = await response.json();
    dispatch({ type: URLJI_FORM_SUBMITTED, payload });
  } catch (error) {
    dispatch({ type: URLJI_FORM_ERROR, payload: { message: error.message } });
  }
}
