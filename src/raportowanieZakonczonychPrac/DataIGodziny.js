import { DatePicker, TimePicker } from 'antd';
import 'antd/dist/antd.css';
import classNames from 'classnames/bind'
import moment from 'moment';
import { StatusInfo } from "./StatusInfo";

export const Dzien = ({ params, callbacks }) => {
    const { data, refDate } = params;
    function disabledDate(current) {
        return current && current > moment().endOf('day');
    }
    return (
        <div className={classNames(
            {
                'fields_group': true,
                'fields_group_niepoprawne_dane': !data,
            })}>
            <DatePicker bordered={false} placeholder='Wybierz datę' ref={refDate}
                onChange={(date, dateString) => callbacks.wybierzDate(date)} 
                disabledDate={disabledDate} />
            <StatusInfo poprawneDane={data} />
        </div>
    )
}

export const GodzinaRozpoczecia = ({ params, callbacks }) => {
    const { data, godzinaStart, godzinaEnd, przepracowano } = params;
    const format = 'HH:mm';

    return (
        <div className={classNames(
            {
                'fields_group': true,
                'fields_group_niepoprawne_dane': !godzinaStart,
            })}>
            <TimePicker bordered={false} format='HH:mm' placeholder='rozpoczęcie' showNow={false} 
                disabledHours={() => disabledHours(data)}
                onSelect={(date) => callbacks.wybierzGodzineRozpoczecia(date)}
                onChange={(date, dateString) => callbacks.wybierzGodzineRozpoczecia(date)}
                value={godzinaStart} />
            <StatusInfo poprawneDane={godzinaStart} />
            {/* {godzinaStart && godzinaStart.format("yyyy-MM-DD HH:mm:ss")}{' start'}
                                            <br />{godzinaEnd && godzinaEnd.format("yyyy-MM-DD HH:mm:ss")}{' end'} 
                                            <br />{przepracowano && przepracowano.format("yyyy-MM-DD HH:mm:ss")}{' przepracowano'} */}
        </div>
    )
}

export const GodzinaZakonczenia = ({ params, callbacks }) => {
    const { data, godzinaStart, godzinaEnd, przepracowano } = params;
    const format = 'HH:mm';

    return (
        <div className={classNames(
            {
                'fields_group': true,
                'fields_group_niepoprawne_dane': !godzinaEnd,
            })}>
            <TimePicker bordered={false} format={format} placeholder='zakończenie'
                disabledHours={() => disabledHours(data)}
                onSelect={callbacks.wybierzGodzineZakonczenia}
                onChange={callbacks.wybierzGodzineZakonczenia} value={godzinaEnd} />
                lub po przepracowaniu
            <TimePicker bordered={false} format={format} showNow={false} suffixIcon={null} allowClear={false} placeholder='godz:min'
                onSelect={callbacks.wybierzPrzepracowano} value={przepracowano}
                onChange={callbacks.wybierzPrzepracowano} value={przepracowano} />
            <StatusInfo poprawneDane={godzinaEnd} />
        </div>
    )
}

function disabledHours(data) {
    var hours = [];
    if (moment.isMoment(data) && data.isSame(moment(), 'day')) {
        for (var i = moment().hour() + 1; i < 24; i++) {
            hours.push(i);
        }
    }
    return hours;
}