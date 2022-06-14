export const consts = {
    ENDPOINT_URL: '/eoffice/production/konczenie_biezacej_pracy/konczenie_biezacej_pracy_json_endpoint.xml',
}

export const DataProvider = {

    wyslijNaSerwer: (additionalFields, promiseHandler, errorHandler) => {
        const doWyslania = Object.assign({}, { ...additionalFields })
        const doWyslaniaJson = JSON.stringify(doWyslania)

        fetch(consts.ENDPOINT_URL + '?action=zapisz_prace', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded' //'Content-Type': 'application/json' 
            },
            body: 'raportujPraceBody=' + doWyslaniaJson
        })
            .then(response => {
                if (!response.ok) {
                    return Promise.reject();
                }
                return response.json()
            })
            .then(json => {
                if (json.is_request_successful === false) {
                    const error_message = json.error_message
                    const errorCause = json.cause
                    return Promise.reject({ error_message, errorCause })
                }
                const fromServer = json

                promiseHandler(fromServer)
            })
            .catch(error => errorHandler(error))
    },

}