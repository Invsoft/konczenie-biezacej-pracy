import { DatePicker, TimePicker } from 'antd';
import 'antd/dist/antd.css';
import classNames from 'classnames/bind'
import moment from 'moment';
import { StatusInfo } from "./StatusInfo";

export const CzasPracy = ({ params, callbacks }) => {
    const { isLoading, godzinaEnd, przepracowano } = params;
    const format = 'HH:mm';

    return (
        <div className={classNames(
            {
                'fields_group': true,
                'fields_group_niepoprawne_dane': !godzinaEnd,
            })}>
            <TimePicker bordered={false} format={format} placeholder='zakończenie'
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