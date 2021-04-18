import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {translateErrorMessage} from "../funcs/errors"

export const Container = ToastContainer;

export const notifySuccess = (content) =>
  toast.success(content, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });

export const notifyWarn = (content) =>
  toast.warn(content, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });

export const notifyInfo = (content) =>
  toast.info(content, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });

export const notifyError = (content) =>
  toast.error(translateErrorMessage(content), {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
