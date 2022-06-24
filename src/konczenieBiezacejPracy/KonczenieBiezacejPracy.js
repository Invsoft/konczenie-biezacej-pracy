import React, { useState, useEffect } from 'react';
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
    const idPracaDoZakonczenia = parsedUrl.searchParams.get("id") || "184777746"

    const [isLoading, setIsLoading] = useState(false)
    const [isZapisanoPraceModalOpen, setZapisanoPraceModalOpen] = React.useState(false)
    const [ostatnioZapisanaPraca, setOstatnioZapisanaPraca] = useState(null)
    //const [zapisanePrace, setZapisanePrace] = useState([])

    const [pracownik, setPracownik] = useState(null)
    const [zlecenie, setZlecenie] = useState(null)
    const [element, setElement] = useState(null)
    const [operacjaWybrana, setOperacjaWybrana] = useState(null)
    const [pracaDoZakonczenia, setPracaDoZakonczenia] = useState(null)

    const [dataGodzinaZakonczenia, setDataGodzinaZakonczenia] = useState(null)

    const [moznaZapisac, setMoznaZapisac] = useState(false)

    useEffect(() => {
        //loadPracownicy()
        loadPracaDoZakonczenia()
    }, [])

    async function loadPracaDoZakonczenia() {
        setIsLoading(true)
        const jsonName = consts.ENDPOINT_URL + `?action=pobierz_rozpoczeta_prace_json&id=${idPracaDoZakonczenia}`
        const response = await fetch(jsonName);
        const myJson = await response.json();

        setPracownik(myJson.employee)
        setZlecenie(myJson.orderProduction)
        setElement(myJson.element)
        setOperacjaWybrana(myJson.operation)
        setPracaDoZakonczenia(myJson.startedWork)
        
        setIsLoading(false)
    }

    const callbacks = {
        setLoadind: (loading) => setIsLoading(loading),
        setZapisanoPraceModalOpen: (open) => setZapisanoPraceModalOpen(open),
        wybierzDataGodzinaZakonczenia: czasString => {
            setDataGodzinaZakonczenia(czasString)
            setMoznaZapisac(czasString != null)
        },
        zapiszPrace: () => {
            setIsLoading(true)
            DataProvider.wyslijNaSerwer(
                {
                    pracaDoZakonczenia: pracaDoZakonczenia.id,
                    dataGodzinaZakonczenia: dataGodzinaZakonczenia,
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
        poZapisieZakoncz: () => {
            window.parent.act('list');
        }
    }
    const params = {
        isLoading: isLoading,
        isZapisanoPraceModalOpen,
        ostatnioZapisanaPraca,

        pracownik,
        zlecenie: zlecenie,
        elementWybrany: element,
        operacjaWybrana,
        pracaDoZakonczenia,

        dataGodzinaZakonczenia,

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