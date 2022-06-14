import React, { useState, useEffect, useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { IntlProvider } from 'react-intl'
//import _ from 'lodash'
import './KonczenieBiezacejPracy.css'
import { messagesOf } from '../tools/i18nConfig'
import { consts, DataProvider } from './DataProvider'
import { PanelSemantic } from './PanelSemantic';
import { ZapisanoPraceModal } from './ZapisanoPraceModal'
//import { from } from 'rxjs';

export const KonczenieBiezacejPracy = () => {
    const parsedUrl = new URL(window.location.href)
    const lang = parsedUrl.searchParams.get("lang") || "pl"
    const idPracaDoZakonczenia = parsedUrl.searchParams.get("id") || "160548388"

    const [isLoading, setIsLoading] = useState(false)
    const [isZapisanoPraceModalOpen, setZapisanoPraceModalOpen] = React.useState(false)
    const [ostatnioZapisanaPraca, setOstatnioZapisanaPraca] = useState(null)
    //const [zapisanePrace, setZapisanePrace] = useState([])

    const [pracownik, setPracownik] = useState(null)

    const [zlecenieWybrane, setZlecenieWybrane] = useState(null)
    const refZlecenie = useRef(null);

    const [elementWybrany, setElementWybrany] = useState(null)
    const refElement = useRef(null);

    const [operacjaWybrana, setOperacjaWybrana] = useState(null)
    const refOperacja = useRef(null);

    const [data, setData] = useState(null)
    const refDate = useRef(null);
    const [godzinaStart, setGodzinaStart] = useState(null)
    const [godzinaEnd, setGodzinaEnd] = useState(null)
    const [przepracowano, setPrzepracowano] = useState(null)

    const [moznaZapisac, setMoznaZapisac] = useState(false)

    useEffect(() => {
        //loadPracownicy()
        loadPracaDoZakonczenia()
    }, [])
    // useEffect(() => {
    //     setElementyZlecenia([])
    //     setElementWybrany(null)
    //     setOperacje([])
    //     setOperacjaWybrana(null)
    //     if (zlecenieWybrane && zlecenieWybrane.id > 0)
    //         loadElementyZlecenia(zlecenieWybrane.id)
    // }, [zlecenieWybrane])
    // useEffect(() => {
    //     setOperacje([])
    //     setOperacjaWybrana(null)
    //     if (zlecenieWybrane && zlecenieWybrane.id > 0 && elementWybrany)
    //         loadOperacje(zlecenieWybrane.id, elementWybrany.id)
    // }, [zlecenieWybrane, elementWybrany])
    // useEffect(() => {
    //     const zdefiniowaneObiekty = pracownik && pracownik.id > 0 && operacjaWybrana && data && godzinaStart && godzinaEnd
    //     const canSave = !!zdefiniowaneObiekty
    //     //console.log('canSave', canSave)
    //     setMoznaZapisac(canSave)
    // }, [pracownik, operacjaWybrana, data, godzinaStart, godzinaEnd])

    async function loadPracaDoZakonczenia() {
        setIsLoading(true)
        const jsonName = consts.ENDPOINT_URL + `?action=pobierz_rozpoczeta_prace_json&id=${idPracaDoZakonczenia}`
        const response = await fetch(jsonName);
        const myJson = await response.json();

        setPracownik(myJson.employee)
        setZlecenieWybrane(myJson.orderProduction)
        setElementWybrany(myJson.element)
        setOperacjaWybrana(myJson.operation)
        
        setIsLoading(false)
    }

    const callbacks = {
        setLoadind: (loading) => setIsLoading(loading),
        setZapisanoPraceModalOpen: (open) => setZapisanoPraceModalOpen(open),
        wybierzPracownika: (pracownik) => {
            // console.log('wybierzPracownika id', id)
            // const index = _.findIndex(pracownicy, { 'id': id });
            // if (index > -1) {
            //     setPracownik(pracownicy[index])
            // }
            //console.log('wybierzPracownika ', pracownik)
            setPracownik(pracownik)
            if (pracownik) document.getElementById('zlecenie_search').focus()
        },
        wybierzZlecenie: (zlecenie) => {
            setZlecenieWybrane(zlecenie)
        },
        wybierzElement: (element) => {
            setElementWybrany(element)
        },
        wybierzOperacje: (operacja) => {
            setOperacjaWybrana(operacja)
            refDate.current.focus()
        },
        wybierzDate: (dzien) => {
            setData(dzien)
        },
        wybierzGodzineRozpoczecia: (czas) => {
            setGodzinaStart(czas)
        },
        wybierzGodzineZakonczenia: (czas) => {
            setGodzinaEnd(czas)
        },
        wybierzPrzepracowano: (czas) => {
            setPrzepracowano(czas)
        },
        zapiszPrace: () => {
            setIsLoading(true)
            DataProvider.wyslijNaSerwer(
                {
                    employeeId: pracownik.id,
                    operacjaId: operacjaWybrana.id,
                    date: data.format("yyyy-MM-DD"),
                    start_task_time: godzinaStart.format("HH:mm") + ":00",
                    end_task_time: godzinaEnd.format("HH:mm") + ":00",
                },
                fromServer => {
                    //console.log('zapiszPrace fromServer', fromServer)
                    setZapisanoPraceModalOpen(true)
                    setOstatnioZapisanaPraca(fromServer.zapisanaPraca)
                    setIsLoading(false)
                }, error => {
                    //console.log('zapiszPrace error', error)
                    wyswietlKomunikatBledu(error)
                    setIsLoading(false)
                })
        },
        poZapisieWprowadzKolejnaPrace: () => {
            //window.location.assign('/eoffice/react/raportowanie_zakonczonych_prac/index.html');
            //setZlecenieWybrane(null)
            setElementWybrany(null)
            setGodzinaStart(godzinaEnd)
            setGodzinaEnd(null)
            setPrzepracowano(null)
        }
    }
    const params = {
        isLoading: isLoading,
        isZapisanoPraceModalOpen,
        ostatnioZapisanaPraca,

        pracownik,
        zlecenieWybrane,
        refZlecenie,

        elementWybrany,
        refElement,

        operacjaWybrana,
        refOperacja,

        refDate,
        data,
        godzinaStart,
        godzinaEnd,
        przepracowano,

        moznaZapisac,
    }
    const wyswietlKomunikatBledu = error => {
        toast.error(<span>Błąd: {trescKomunikatuBledu(error)}</span>);
    }

    const trescKomunikatuBledu = error => {
        if (typeof error === 'undefined') return 'server_error'
        const { error_message, errorCause } = error
        let komunikatBledu = error_message || errorCause || ''
        if (typeof komunikatBledu === 'object') {
            komunikatBledu = 'server_error'
        }
        return komunikatBledu
    }

    return (
        <IntlProvider locale={lang} messages={messagesOf(lang)}>
            <div className="mainPanel">
                <header id="main_header">
                    Kończenie bieżącej pracy
                </header>
                <PanelSemantic params={params} callbacks={callbacks} />
            </div>
            <ToastContainer
                position={toast.POSITION.TOP_RIGHT}
                closeOnClick={false}
                autoClose={6000}
                hideProgressBar={true}
            />
            <ZapisanoPraceModal params={params} callbacks={callbacks} />
        </IntlProvider>
    )
}