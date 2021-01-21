import React, { useState, useEffect, useRef } from 'react';
import { Modal, Button } from 'semantic-ui-react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { IntlProvider } from 'react-intl'
import preval from 'preval.macro';
import _ from 'lodash'
import moment from 'moment';
import './RaportujZakonczonaPrace.css'
import { messagesOf } from './../tools/i18nConfig'
import { consts, DataProvider } from './DataProvider'
import { PanelSemantic } from './PanelSemantic';

export const RaportujZakonczonaPrace = () => {
    const build_date = preval`module.exports = new Date();`
    const parsedUrl = new URL(window.location.href)
    const lang = parsedUrl.searchParams.get("lang") || "pl"
    const [openModal, setOpenModal] = React.useState(false)

    const [pracownicy, setPracownicy] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [pracownik, setPracownik] = useState(null)

    const [zlecenieWybrane, setZlecenieWybrane] = useState(null)
    const [id_order_production, setId_order_production] = useState(0)
    const refZlecenie = useRef(null);

    const [elementyLoading, setElementyLoading] = useState(false)
    const [elementyZlecenia, setElementyZlecenia] = useState([])
    const [elementWybrany, setElementWybrany] = useState(null)
    const [id_element, setId_element] = useState(0)
    const refElement = useRef(null);

    const [operacjeLoading, setOperacjeLoading] = useState(false)
    const [operacje, setOperacje] = useState([])
    const [operacjaWybrana, setOperacjaWybrana] = useState(null)
    const refOperacja = useRef(null);

    const [data, setData] = useState(null)
    const refDate = useRef(null);
    const [godzinaStart, setGodzinaStart] = useState(null)
    const [godzinaEnd, setGodzinaEnd] = useState(null)
    const [przepracowano, setPrzepracowano] = useState(null)

    const [moznaZapisac, setMoznaZapisac] = useState(false)

    useEffect(() => {
        loadPracownicy()
    }, [])
    useEffect(() => {
        setElementyZlecenia([])
        setElementWybrany(null)
        setId_element(0)
        setOperacje([])
        setOperacjaWybrana(null)
        if (id_order_production > 0)
            loadElementyZlecenia(id_order_production)
    }, [id_order_production])
    useEffect(() => {
        setOperacje([])
        setOperacjaWybrana(null)
        if (id_order_production > 0 && id_element > 0)
            loadOperacje(id_order_production, id_element)
    }, [id_order_production, id_element])
    useEffect(() => {
        const zdefiniowaneObiekty = pracownik && pracownik.id > 0 && operacjaWybrana && data && godzinaStart && godzinaEnd
        const canSave = !!zdefiniowaneObiekty
        //console.log('canSave', canSave)
        setMoznaZapisac(canSave)
    }, [pracownik, operacjaWybrana, data, godzinaStart, godzinaEnd])

    async function loadPracownicy() {
        setIsLoading(true)
        const jsonName = consts.ENDPOINT_URL + '?action=pobierz_pracownikow_json'
        const response = await fetch(jsonName);
        const myJson = await response.json();
        //console.log('myJson', myJson)
        setIsLoading(false)
        setPracownicy(myJson)
    }

    async function loadElementyZlecenia(id_order_production) {
        setElementyLoading(true)
        const jsonName = consts.ENDPOINT_URL + '?action=pobierz_elementy_zlecenia_json&id_order_production=' + id_order_production
        const response = await fetch(jsonName);
        const myJson = await response.json();
        setElementyLoading(false)
        setElementyZlecenia(myJson)
        refElement.current.tryOpen()
    }

    async function loadOperacje(id_order_production, id_element) {
        setOperacjeLoading(true)
        const jsonName = consts.ENDPOINT_URL + '?action=pobierz_operacje_zlecenia_json&id_order_production=' + id_order_production +
            '&id_element=' + id_element
        const response = await fetch(jsonName);
        const myJson = await response.json();
        setOperacjeLoading(false)
        setOperacje(myJson)
        refOperacja.current.tryOpen()
    }

    function momentZERO() {
        return moment("2021-01-01 00:00", "yyyy-MM-DD HH:mm")
    }
    function wyliczPrzepracowano(start, end) {
        if (start && end) {
            const diff = moment.duration(end.diff(start))
            const przepracowano = momentZERO().add(diff.asMinutes(), 'minutes')
            setPrzepracowano(przepracowano)
        }
    }
    function wyliczCzasZakonczenia(start, przepracowano) {
        if (start && przepracowano) {
            const diff = moment.duration(przepracowano.diff(momentZERO()))
            const zakonczono = moment(start).add(diff.asMinutes(), 'minutes')
            setGodzinaEnd(zakonczono)
        }
    }

    const callbacks = {
        setLoadind: (loading) => setIsLoading(loading),
        wybierzPracownika: (pracownik) => {
            // console.log('wybierzPracownika id', id)
            // const index = _.findIndex(pracownicy, { 'id': id });
            // if (index > -1) {
            //     setPracownik(pracownicy[index])
            // }
            console.log('wybierzPracownika ', pracownik)
            setPracownik(pracownik)
            if (pracownik) document.getElementById('zlecenie_search').focus()
        },
        wybierzZlecenie: (zlecenie) => {
            setZlecenieWybrane(zlecenie)
            setId_order_production(zlecenie.id)
            //refElement.current.focus()
            //console.log('wybierzZlecenie refElement', refElement)
        },
        wybierzElement: (element) => {
            setElementWybrany(element)
            setId_element(element.id)
        },
        wybierzOperacje: (operacja) => {
            setOperacjaWybrana(operacja)
            refDate.current.focus()
        },
        wybierzDate: (dzien) => {
            setData(dzien)
        },
        wybierzGodzineRozpoczecia: (czas) => {
            console.log('wybierzGodzineRozpoczecia', czas)
            if (!moment.isMoment(czas)) {
                setGodzinaStart(null)
                setPrzepracowano(momentZERO())
                return
            }
            const czasNormalized = moment("2021-01-01 " + czas.format("HH:mm"), "yyyy-MM-DD HH:mm")
            setGodzinaStart(czasNormalized)
            if (czasNormalized && godzinaEnd) {
                if (czasNormalized.isAfter(godzinaEnd)){
                    setGodzinaEnd(czasNormalized);
                    setPrzepracowano(momentZERO())
                } else {
                    wyliczPrzepracowano(czasNormalized, godzinaEnd)
                }
                return
            }
            if (czasNormalized && przepracowano) {
                wyliczCzasZakonczenia(czasNormalized, przepracowano)
            }
        },
        wybierzGodzineZakonczenia: (czas) => {
            //console.log('wybierzGodzineZakonczenia godzinaStart', godzinaStart)
            console.log('wybierzGodzineZakonczenia', czas)
            if (!moment.isMoment(czas)) {
                setGodzinaEnd(null)
                setPrzepracowano(momentZERO())
                return
            }
            const czasNormalized = moment("2021-01-01 " + czas.format("HH:mm"), "yyyy-MM-DD HH:mm")
            setGodzinaEnd(czasNormalized)
            if (godzinaStart && czasNormalized) {
                if (czasNormalized.isBefore(godzinaStart)){
                    setGodzinaStart(czasNormalized);
                    setPrzepracowano(momentZERO())
                } else {
                    wyliczPrzepracowano(godzinaStart, czasNormalized)
                }
                 
                //setPrzepracowano(moment(czasNormalized).subtract(godzinaStart));
            }
        },
        wybierzPrzepracowano: (czas) => {
            if (!moment.isMoment(czas)) {
                setPrzepracowano(null)
                setPrzepracowano(momentZERO())
                return
            }
            const czasNormalized = moment("2021-01-01 " + czas.format("HH:mm"), "yyyy-MM-DD HH:mm")
            setPrzepracowano(czasNormalized)
            if (godzinaStart && czasNormalized) {
                wyliczCzasZakonczenia(godzinaStart, czasNormalized)
            }
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
                    console.log('zapiszPrace fromServer', fromServer)
                    setOpenModal(true)
                    setIsLoading(false)

                    // if (fromServer.serverInfo && fromServer.serverInfo.cause) {
                    //     toast.error(<span>Błąd: {fromServer.serverInfo.cause}</span>);
                    // }
                    // if (fromServer.serverInfo && fromServer.serverInfo.error === 'Nie znaleziono pracownika lub programu') {
                    //     this.wyswietlLicznikIOdswiezStroneZa(4);
                    // }
                    // else {
                    //     if (fromServer.wlasnieOdczytano === 'pracownik') {
                    //         this.setState({ wlasnieOdczytanoPracownika: true })
                    //         afterSecondsOf(3).subscribe(x => this.setState({ wlasnieOdczytanoPracownika: false }))
                    //     }
                    //     this.focusPoleTekstoweSkanowania();
                    // }
                }, error => {
                    console.log('zapiszPrace error', error)
                    wyswietlKomunikatBledu(error)
                    setIsLoading(false)
                })
        },
    }
    const params = {
        build_date,
        isLoading: isLoading,
        pracownicy,
        pracownik,
        zlecenieWybrane,
        id_order_production,
        refZlecenie,

        elementyLoading,
        elementyZlecenia,
        elementWybrany,
        id_element,
        refElement,

        operacjeLoading,
        operacje,
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
        const komunikatBledu = error_message || errorCause || ''
        if (typeof komunikatBledu === 'object') {
            komunikatBledu = 'server_error'
        }
        return komunikatBledu
    }

    return (
        <IntlProvider locale={lang} messages={messagesOf(lang)}>
            <div className="mainPanel">
                <header id="main_header" data_build_date={build_date}>
                    Raportuj Zakonczoną Pracę
                <span className="timestamp">{build_date.substr(0, 10)}</span>
                </header>
                {/* {data && data.format("yyyy-MM-DD")}
                {' '}start {godzinaStart && godzinaStart.format("HH:mm")}
                {' '}end {godzinaEnd && godzinaEnd.format("HH:mm")}
                {' '}przepracowano {przepracowano && przepracowano.format("HH:mm")} */}
                <PanelSemantic params={params} callbacks={callbacks} />
                {/* <div className="div_czas_pracy">
                    <CzasPracy params={params} callbacks={callbacks} />
                </div> */}
            </div>
            <ToastContainer
                position={toast.POSITION.TOP_RIGHT}
                closeOnClick={false}
                autoClose={6000}
                hideProgressBar={true}
            />
            <Modal
                //onClose={() => setOpenModal(false)}
                onOpen={() => setOpenModal(true)}
                open={openModal}
                //trigger={<Button>Show Modal</Button>}
            >
                <Modal.Header>Zapisano pracę</Modal.Header>
                {/* <Modal.Content image>
                    <Image size='medium' src='https://react.semantic-ui.com/images/avatar/large/rachel.png' wrapped />
                    <Modal.Description>
                        <Header>Default Profile Image</Header>
                        <p>
                            We've found the following gravatar image associated with your e-mail
                            address.
          </p>
                        <p>Is it okay to use this photo?</p>
                    </Modal.Description>
                </Modal.Content> */}
                <Modal.Actions>
                    <Button
                        content="OK, zapisz kolejną pracę"
                        labelPosition='right'
                        icon='checkmark'
                        onClick={() => { 
                            setOpenModal(false); 
                            window.location.assign('/eoffice/react/raportowanie_zakonczonych_prac/index.html');}}
                        positive
                    />
                    <Button color='black' onClick={() => {
                        setOpenModal(false);
                        window.location.assign('/eoffice/production/raport_prac_zakonczonych.xml?action=list&refreshTree=false&go=false&changetree=false');}}>
                        Powrót do listy
                    </Button>
                </Modal.Actions>
            </Modal>
        </IntlProvider>
    )
}