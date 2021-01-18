import React from 'react';
import { Form, Input, Button, Table, Container, Search, Header, Confirm, Icon, Segment, Item } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'
import './PanelSemantic.css'
import classNames from 'classnames/bind'
import _ from 'lodash'
import { Tlumaczenia } from '../tools/Tlumaczenia'
import { PracownikSearch} from "./PracownikSearch";
import { ZlecenieSearch} from './ZlecenieSearch' 
import { ElementSearch } from './ElementSearch' 

import { from } from 'rxjs';

export const PanelSemantic = ({ params, callbacks }) => {
    const { build_date, isLoading, pracownik, id_order_production } = params;
    const pracownikOdczytany = pracownik;
    const zlecenieOdczytane = id_order_production > 0;
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
                                <Table.Cell width={3} className={classNames(
                                    {
                                        'niepoprawne_dane': !pracownikOdczytany,
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
                                        'niepoprawne_dane': !zlecenieOdczytane,
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
                                        'niepoprawne_dane': true,
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
                                        'niepoprawne_dane': true,
                                    })}>
                                    {/* <ListaOperacji raportujZlecenie={raportujZlecenie} onChange={this.handleChange} /> */}
                                </Table.Cell>
                            </Table.Row>
                            <Table.Row key='prace'>
                                <Table.Cell>
                                    <Tlumaczenia id="Trwające prace" />
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

