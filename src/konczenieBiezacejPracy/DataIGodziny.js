import React, { useState } from 'react'
import { TimePicker } from 'antd'
import 'antd/dist/antd.css'
import classNames from 'classnames/bind'
import moment from 'moment'
import { StatusInfo } from './StatusInfo'

export const GodzinaZakonczenia = ({ params, callbacks }) => {
  const { pracaDoZakonczenia, dataGodzinaZakonczenia } = params //, godzinaEnd, przepracowano
  const FORMAT_KONTROLEK_CZASU = 'HH:mm'
  const FORMAT_ZWRACANEGO_ZAKONCZENIA_PRACY = 'yyyy-MM-DD HH:mm'
  const pobranoDane = pracaDoZakonczenia !== undefined

  const [godzinaEnd, setGodzinaEnd] = useState(null)
  const [przepracowano, setPrzepracowano] = useState(null)

  function poprawnyCzas (czas) {
    return moment.isMoment(czas)
  }

  const handleGodzinaZakonczenia = (czas) => {
    if (!poprawnyCzas(czas)) {
      setGodzinaEnd(null)
      setPrzepracowano(momentZERO())
      return
    }
    const godzinaZakonczenia = normalizeTime(czas)
    setGodzinaEnd(godzinaZakonczenia)

    if (pobranoDane) {
      const rozpoczeciePracy = moment(pracaDoZakonczenia.start_datetime)
      const dataCzasZakonczenia = wyliczCzasZakonczenia(rozpoczeciePracy, godzinaZakonczenia)
      callbacks.wybierzDataGodzinaZakonczenia(dataCzasZakonczenia.format(FORMAT_ZWRACANEGO_ZAKONCZENIA_PRACY))

      { // wylicz przepracowano
        const diff = moment.duration(dataCzasZakonczenia.diff(rozpoczeciePracy))
        const przepracowano = momentZERO().add(diff.asMinutes(), 'minutes')
        console.log('przepracowano', przepracowano, diff)
        setPrzepracowano(przepracowano)
      }
    }
  }

  const handlePrzepracowano = (czas) => {
    if (!poprawnyCzas(czas)) {
      setPrzepracowano(momentZERO())
      return
    }
    const przepracowano = normalizeTime(czas) // moment("2021-01-01 " + czas.format("HH:mm"), "yyyy-MM-DD HH:mm")
    setPrzepracowano(przepracowano)
    if (pobranoDane) {
      const rozpoczeciePracy = moment(pracaDoZakonczenia.start_datetime)
      const diff = moment.duration(przepracowano.diff(momentZERO()))
      const zakonczono = rozpoczeciePracy.add(diff.asMinutes(), 'minutes')
      callbacks.wybierzDataGodzinaZakonczenia(zakonczono.format(FORMAT_ZWRACANEGO_ZAKONCZENIA_PRACY))
      setGodzinaEnd(zakonczono)
    }
  }

  return (
    <div>
      <div className='fields_group'>
        <div className='wybrana_data_zakonczenia '>{dataGodzinaZakonczenia}</div>
        <StatusInfo poprawneDane={godzinaEnd} />
      </div>
      <div className={classNames(
        {
          fields_group: true,
          fields_group_niepoprawne_dane: !godzinaEnd
        })}
      >
        <TimePicker
          bordered={false} format={FORMAT_KONTROLEK_CZASU} placeholder='zakończenie'
                // disabledHours={() => disabledHours(data)}
          onSelect={handleGodzinaZakonczenia}
          onChange={handleGodzinaZakonczenia} value={godzinaEnd}
        />
        lub po przepracowaniu
        <TimePicker
          bordered={false} format={FORMAT_KONTROLEK_CZASU} showNow={false} suffixIcon={null} allowClear={false} placeholder='godz:min'
                // disabledMinutes={przepracowanoDisabledMinutes}
          onSelect={handlePrzepracowano}
          onChange={handlePrzepracowano} value={przepracowano}
        />

        {/* {
                godzinaPozniejszaOdBiezacej(data, godzinaEnd) &&
                <span style={{ color: "red" }}>Godzina zakończenia późniejsza od bieżącej</span>
            } */}
      </div>
    </div>
  )
}

const DATE_ZERO = '2021-01-01'

/**
 * Zwraca umowny czas odniesienia.
 * @return {moment}
 */
function momentZERO () {
  return moment(DATE_ZERO + ' 00:00', 'yyyy-MM-DD HH:mm')
}

/**
 * Pozostawia godziny i minuty.
 * @param {moment} timeMoment czas do normalizacji.
 * @return {moment} Godziny i minuty z timeMoment + momentZERO
 */
function normalizeTime (timeMoment) {
  return moment(DATE_ZERO + ' ' + timeMoment.format('HH:mm'), 'yyyy-MM-DD HH:mm')
}

/**
 * zwraca wyliczony czas zakończenia. Do daty i godziny rozpoczęcia następuje dodanie godziny zakończenia.
 * Jeśli godzina zakończenia jest wcześniejsza od godziny rozpoczęcia uznaje się że praca zakończyła się po północy
 * @param {moment} rozpoczeciePracy data i godzina rozpoczecia pracy.
 * @param {moment} godzinaZakonczenia - godzina zakończenia pracy.
 * @return {moment} wyliczony czas zakończenia
 */
function wyliczCzasZakonczenia (rozpoczeciePracy, godzinaZakonczenia) {
  const godzinaStart = normalizeTime(rozpoczeciePracy)
  const godzinaStop = normalizeTime(godzinaZakonczenia)
  const diff = moment.duration(godzinaStop.diff(godzinaStart))
  const dataCzasZakonczenia =
        godzinaStart.isBefore(godzinaStop)
          ? moment(rozpoczeciePracy).add(diff.asMinutes(), 'minutes')
          : moment(rozpoczeciePracy).add(1, 'days').add(diff.asMinutes(), 'minutes')
  return dataCzasZakonczenia
}
