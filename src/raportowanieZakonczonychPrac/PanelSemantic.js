import React from 'react';
import { Form, Input, Button, Table, Container, Search, Header, Confirm, Icon, Segment, Item } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'
import './PanelSemantic.css'
import classNames from 'classnames/bind'
import _ from 'lodash'
import { Tlumaczenia } from '../tools/Tlumaczenia'
import { PracownikSearch} from "./PracownikSearch";
import { ZlecenieSearch } from './ZlecenieSearch' 
import { ElementSearch } from './ElementSearch'
import { OperacjaSearch } from "./OperacjaSearch";
import { StatusInfo } from "./StatusInfo";
import { CzasPracy } from "./CzasPracy";
import { DatePicker, TimePicker } from 'antd';
import 'antd/dist/antd.css';
import moment from 'moment';
import { from } from 'rxjs';

export const PanelSemantic = ({ params, callbacks }) => {
    const { build_date, isLoading, pracownik, id_order_production, id_element, operacjaWybrana, data, godzinaStart, godzinaEnd,
        przepracowano, refDate, moznaZapisac } = params;
    const pracownikOdczytany = pracownik;
    const zlecenieOdczytane = id_order_production > 0;
    const elementOdczytany = id_element > 0;
    const operacjaOdczytana = operacjaWybrana;
    //console.log('PanelSemantic callbacks', callbacks)
    return (
        <Container textAlign='center'>
            <Form autoComplete="off" loading={isLoading}>
                {/* <Header as='h2' id={build_date+"_sem"}>
                    <Tlumaczenia id="Raportowanie czasu pracy – SAP" />
                    <span className="timestamp">{build_date.substr(0, 10)}</span>
                </Header> */}
                <Segment.Group>
                <Segment>
                    <Table celled striped>
                        <Table.Body>
                            <Table.Row key='pracownik'>
                                <Table.Cell width={1}>
                                    <Tlumaczenia id="Pracownik" />
                                </Table.Cell>
                                <Table.Cell width={10} className={classNames(
                                    {
                                        'niepoprawne_dane': false,
                                    })}>
                                    {/* {pracownikOdczytany ? raportujZlecenie.getEmployeeFulname() : <Tlumaczenia id="brak" />} */}
                                        <PracownikSearch params={params} callbacks={callbacks}/>
                                </Table.Cell>
                            </Table.Row>
                            <Table.Row key='zlecenie'>
                                <Table.Cell width={1}>
                                    <Tlumaczenia id="Zlecenie" />
                                </Table.Cell>
                                <Table.Cell width={3} className={classNames(
                                    {
                                        'niepoprawne_dane': false,
                                    })}>
                                    {/* {zlecenieOdczytane ? raportujZlecenie.zlecenieOpis() : <Tlumaczenia id="brak" />} */}
                                        <ZlecenieSearch params={params} callbacks={callbacks}/>
                                </Table.Cell>
                            </Table.Row>
                            <Table.Row key='element'>
                                <Table.Cell width={1}>
                                    <Tlumaczenia id="Element" />
                                </Table.Cell>
                                <Table.Cell width={3} className={classNames(
                                    {
                                        'niepoprawne_dane': false,
                                    })}>
                                    {/* {elementOdczytany ? raportujZlecenie.elementOpis() : <Tlumaczenia id="brak" />} */}
                                        <ElementSearch params={params} callbacks={callbacks} />
                                </Table.Cell>
                            </Table.Row>
                            <Table.Row key='operacja'>
                                <Table.Cell width={1}>
                                    <Tlumaczenia id="Operacja technologiczna" />
                                </Table.Cell>
                                <Table.Cell width={3} className={classNames(
                                    {
                                        'niepoprawne_dane': false,
                                    })}>
                                    {/* <ListaOperacji raportujZlecenie={raportujZlecenie} onChange={this.handleChange} /> */}
                                        <OperacjaSearch params={params} callbacks={callbacks} />
                                </Table.Cell>
                            </Table.Row>
                            <Table.Row key='data'>
                                <Table.Cell>
                                        Data{/* <Tlumaczenia id="Data" /> */}
                                </Table.Cell>
                                <Table.Cell>
                                        <div className={classNames(
                                            {
                                                'fields_group': true,
                                                'fields_group_niepoprawne_dane': !data,
                                            })}>
                                            <DatePicker bordered={false} placeholder='Wybierz datę' ref={refDate}
                                                onChange={(date, dateString) => callbacks.wybierzDate(date)} />
                                            <StatusInfo poprawneDane={data} />
                                        </div>
                                </Table.Cell>
                            </Table.Row>
                            <Table.Row key='godzina_start'>
                                <Table.Cell>
                                    Godzina rozpoczęcia
                                </Table.Cell>
                                <Table.Cell>
                                        <div className={classNames(
                                            {
                                                'fields_group': true,
                                                'fields_group_niepoprawne_dane': !godzinaStart,
                                            })}>
                                            <TimePicker bordered={false} format='HH:mm' placeholder='rozpoczęcie'
                                                onSelect={(date) => callbacks.wybierzGodzineRozpoczecia(date)} 
                                                onChange={(date, dateString) => callbacks.wybierzGodzineRozpoczecia(date)}
                                                value={godzinaStart}/>
                                            <StatusInfo poprawneDane={godzinaStart} />
                                            {godzinaStart && godzinaStart.format("yyyy-MM-DD HH:mm:ss")}{' start'}
                                            <br />{godzinaEnd && godzinaEnd.format("yyyy-MM-DD HH:mm:ss")}{' end'} 
                                            <br />{przepracowano && przepracowano.format("yyyy-MM-DD HH:mm:ss")}{' przepracowano'}
                                            <br />{moment(godzinaEnd).subtract(godzinaStart).format("yyyy-MM-DD HH:mm:ss")}{' moment '}
                                        </div>
                                </Table.Cell>
                            </Table.Row>
                            <Table.Row key='data_czas'>
                                <Table.Cell>
                                        Godzina zakończenia
                                </Table.Cell>
                                <Table.Cell>
                                        <CzasPracy params={params} callbacks={callbacks} />
                                </Table.Cell>
                            </Table.Row>
                            <Table.Row key='zapisz'>
                                {/* <Table.Cell>
                                </Table.Cell> */}
                                    <Table.HeaderCell colSpan='2'>{/*  colSpan='2' */}
                                        {moznaZapisac ? 'moznaZapisac' : 'NIEmoznaZapisac'}
                                        <Button color='teal' fluid size='large' disabled={!moznaZapisac} loading={isLoading} 
                                            onClick={(evt) => callbacks.zapiszPrace()}
                                            >Zapisz</Button>                                    
                                </Table.HeaderCell>
                            </Table.Row>
                            <Table.Row key='prace'>
                                <Table.Cell>
                                    Prace pracownika
                                </Table.Cell>
                                <Table.Cell>
                                    {/* {pracownikOdczytany
                                        ?
                                        <TrwajacePrace raportujZlecenie={raportujZlecenie}
                                            handlePrzerwijPrace={this.handlePrzerwijPrace}
                                            handleZakonczPrace={this.handleZakonczPrace} />
                                        : ''} */}
                                </Table.Cell>
                            </Table.Row>
                        </Table.Body>
                    </Table>
                </Segment>
                </Segment.Group>
            </Form>
        </Container >
    )
}

