import React from 'react';
import { Form, Button, Table, Container, Segment } from 'semantic-ui-react'
import './PanelSemantic.css'
import classNames from 'classnames/bind'
import _ from 'lodash'
import { Tlumaczenia } from '../tools/Tlumaczenia'
import { PracownikSearch} from "./PracownikSearch";
import { ZlecenieSearch } from './ZlecenieSearch' 
import { ElementSearch } from './ElementSearch'
import { OperacjaSearch } from "./OperacjaSearch";
import { Dzien, GodzinaRozpoczecia, GodzinaZakonczenia } from "./DataIGodziny";
//import { StatusInfo } from "./StatusInfo";
//mport 'antd/dist/antd.css';
import { from } from 'rxjs';

export const PanelSemantic = ({ params, callbacks }) => {
    const { isLoading, pracownik, zlecenieWybrane, elementWybrany, operacjaWybrana, moznaZapisac } = params;
    const pracownikOdczytany = pracownik;
    //console.log('PanelSemantic elementWybrany', elementWybrany)
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
                                        {pracownikOdczytany && pracownikOdczytany.surname + ' ' + pracownikOdczytany.name}
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
                                        {zlecenieWybrane && zlecenieWybrane.object_index + ' ' + zlecenieWybrane.title}
                                        {/* <ZlecenieSearch params={params} callbacks={callbacks}/> */}
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
                                        {elementWybrany && elementWybrany.object_index + ' ' + elementWybrany.title }
                                        {/* <ElementSearch params={params} callbacks={callbacks} /> */}
                                </Table.Cell>
                            </Table.Row>
                            <Table.Row key='operacja'>
                                <Table.Cell width={1}>
                                    <Tlumaczenia id="Operacja" />
                                </Table.Cell>
                                <Table.Cell width={3} className={classNames(
                                    {
                                        'niepoprawne_dane': false,
                                    })}>
                                        {/* <OperacjaSearch params={params} callbacks={callbacks} /> */}
                                        {operacjaWybrana && operacjaWybrana.title }
                                </Table.Cell>
                            </Table.Row>
                            <Table.Row key='data'>
                                <Table.Cell>
                                        Data{/* <Tlumaczenia id="Data" /> */}
                                </Table.Cell>
                                <Table.Cell>
                                        <Dzien params={params} callbacks={callbacks} />
                                </Table.Cell>
                            </Table.Row>
                            <Table.Row key='godzina_start'>
                                <Table.Cell>
                                    Godzina rozpoczęcia
                                </Table.Cell>
                                <Table.Cell>
                                        <GodzinaRozpoczecia params={params} callbacks={callbacks} />
                                </Table.Cell>
                            </Table.Row>
                            <Table.Row key='data_czas'>
                                <Table.Cell>
                                        Godzina zakończenia
                                </Table.Cell>
                                <Table.Cell>
                                        <GodzinaZakonczenia params={params} callbacks={callbacks} />
                                </Table.Cell>
                            </Table.Row>
                            <Table.Row key='zapisz'>
                                {/* <Table.Cell>
                                </Table.Cell> */}
                                    <Table.HeaderCell colSpan='2'>{/*  colSpan='2' */}
                                        {/* {moznaZapisac ? 'moznaZapisac' : 'NIEmoznaZapisac'} */}
                                        <Button color='teal' fluid size='large' disabled={!moznaZapisac} loading={isLoading} 
                                            onClick={(evt) => callbacks.zapiszPrace()}
                                            >Zapisz</Button>                                    
                                </Table.HeaderCell>
                            </Table.Row>
                            {/* <Table.Row key='prace'>
                                <Table.Cell>
                                    Prace pracownika
                                </Table.Cell>
                                <Table.Cell>
                                    {pracownikOdczytany
                                        ?
                                        <TrwajacePrace raportujZlecenie={raportujZlecenie}
                                            handlePrzerwijPrace={this.handlePrzerwijPrace}
                                            handleZakonczPrace={this.handleZakonczPrace} />
                                        : ''}
                                </Table.Cell>
                            </Table.Row> */}
                        </Table.Body>
                    </Table>
                </Segment>
                </Segment.Group>
            </Form>
        </Container >
    )
}

