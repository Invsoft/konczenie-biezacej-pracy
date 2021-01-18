import React, { useState, useEffect } from 'react';
import { IntlProvider } from 'react-intl'
import preval from 'preval.macro';
import _ from 'lodash'
import './RaportujZakonczonaPrace.css'
import { messagesOf } from './../tools/i18nConfig'
import { consts} from './consts'
import { PanelSemantic} from './PanelSemantic';

export const RaportujZakonczonaPrace = () => {
    const build_date = preval`module.exports = new Date();`
    const parsedUrl = new URL(window.location.href)
    const lang = parsedUrl.searchParams.get("lang") || "pl"

    const [pracownicy, setPracownicy] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [pracownik, setPracownik] = useState(null)
    const [zlecenieWybrane, setZlecenieWybrane] = useState(null)
    const [id_order_production, setId_order_production] = useState(0)

    const [elementyLoading, setElementyLoading] = useState(false)
    const [elementyZlecenia, setElementyZlecenia] = useState([])


    useEffect(() => {
        loadPracownicy()
    }, [])
    useEffect(() => {
        if (id_order_production>0)
        loadElementyZlecenia(id_order_production)
    }, [id_order_production])

    async function loadPracownicy() {
        setIsLoading(true)
        const jsonName = consts.ENDPOINT_URL+'?action=pobierz_pracownikow_json'
        const response = await fetch(jsonName);
        const myJson = await response.json();
        //console.log('myJson', myJson)
        setIsLoading(false)
        setPracownicy(myJson)
    }

    async function loadElementyZlecenia(id_order_production) {
        setElementyLoading(true)
        const jsonName = consts.ENDPOINT_URL + '?pobierz_elementy_zlecenia_json&id_order_production=' + id_order_production
        const response = await fetch(jsonName);
        const myJson = await response.json();
        setElementyLoading(false)
        setElementyZlecenia(myJson)
    }

    const callbacks = {
        setLoadind: (loading) => setIsLoading(loading),
        wybierzPracownika: (id) => {
            console.log('wybierzPracownika id', id)
            const index = _.findIndex(pracownicy, { 'id': id });
            if (index > -1) {
                setPracownik(pracownicy[index])
            }
            console.log('wybierzPracownika ', pracownik)
            setIsLoading(false)
        },
        wybierzZlecenie: (zlecenie) => {
            setZlecenieWybrane(zlecenie)
            setId_order_production(zlecenie.id)
        },
    }
    const params = {
        build_date,
        isLoading: isLoading,
        pracownicy,
        pracownik,
        zlecenieWybrane,

        elementyLoading,
        elementyZlecenia,
    }

    return (
        <IntlProvider locale={lang} messages={messagesOf(lang)}>
        <div className="mainPanel">
                <header id="main_header" data_build_date={build_date}>
                    Raportuj Zakonczoną Pracę
                <span className="timestamp">{build_date.substr(0, 10)}</span>
                </header> {pracownicy.length}
                <PanelSemantic params={params} callbacks={callbacks} />
        </div>
        </IntlProvider>
    )
}