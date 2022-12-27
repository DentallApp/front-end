import { parseBool } from 'utils/parseUtils'

//eslint-disable-next-line
export const formatNames = /^[ÁÉÍÓÚA-Za-záéíóúñÑ]+([\s]{0,}[ÁÉÍÓÚA-ZÑ]?[a-záéíóúñ]+[\s]{0,}){0,}$/;
export const formatIdentityDocument = parseBool(process.env.REACT_APP_DISABLE_IDENTITY_VALIDATION) ? "" : /^[0-9]{10}$/;
//eslint-disable-next-line
export const formatEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
//eslint-disable-next-line
export const formatPassword = /[A-Za-zÁÉÍÓÚáéíóú0-9\-\_\@\#\$\%\?\[\]\+\.]+$/;
//eslint-disable-next-line
export const formatPhone = /^[09]{2}[0-9]+$/;

export const formatPrice = /^\d+(?:\.\d{1,2})?$/;

export const formatSecurePassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d (@$!%*?_\-&)?]{5,}$/;

//eslint-disable-next-line
export const formatURL = /\b(?:(?:https?|ftp):\/\/|www\.)[-a-z0-9+&@#\/%?=~_|!:,.;]*[-a-z0-9+&@#\/%=~_|]/;
