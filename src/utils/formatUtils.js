//eslint-disable-next-line
export const formatNames = /^[ÁÉÍÓÚA-Za-záéíóú]+([\s]{0,}[ÁÉÍÓÚA-Z]?[a-záéíóú]+[\s]{0,}){0,1}$/;
export const formatIdentityDocument = /^[0-9]{10}$/;
//eslint-disable-next-line
export const formatEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
//eslint-disable-next-line
export const formatPassword = /[A-Za-zÁÉÍÓÚáéíóú0-9\-\_\@\#\$\%\?\[\]\+\.]+$/;
//eslint-disable-next-line
export const formatPhone = /^[09]{2}[0-9]+$/;

export const formatPrice = /^\d+(?:\.\d{1,2})?$/;
