import React from 'react';
import { Icon, Modal, Button } from 'semantic-ui-react'
import classNames from 'classnames/bind'

export const ZapisanoPraceModal = ({ params, callbacks }) => {
    const { isLoading, isZapisanoPraceModalOpen, ostatnioZapisanaPraca, } = params;
    const openModal = isZapisanoPraceModalOpen

    const setOpenModal = (open) => {
        callbacks.setZapisanoPraceModalOpen(open)
    }

    return (
        <Modal
            //onClose={() => setOpenModal(false)}
            onOpen={() => setOpenModal(true)}
            open={openModal}
        //trigger={<Button>Show Modal</Button>}
        >
            <Modal.Header>Zapisano pracę</Modal.Header>
            {
                ostatnioZapisanaPraca &&
                <Modal.Content>
                    <Modal.Description>
                        {/* <Header>Default Profile Image</Header> */}
                        <p>Pracownik: {ostatnioZapisanaPraca.emp_surname + ' ' + ostatnioZapisanaPraca.emp_name}</p>
                        <p>Zlecenie: {ostatnioZapisanaPraca.zlecenie_index + ' ' + ostatnioZapisanaPraca.zlecenie_title}</p>
                        <p>Element: {ostatnioZapisanaPraca.wyrob_index + ' ' + ostatnioZapisanaPraca.wyrob_title}</p>
                        <p>Operacja: {ostatnioZapisanaPraca.operacja_structure_position + ' ' + ostatnioZapisanaPraca.operacja_title}</p>
                        <p>Czas pracy: {ostatnioZapisanaPraca.start_task_time + ' ' + ostatnioZapisanaPraca.end_task_time}</p>
                    </Modal.Description>
                </Modal.Content>
            }
            <Modal.Actions>
                <Button
                    content="OK, zapisz kolejną pracę"
                    labelPosition='right'
                    icon='checkmark'
                    onClick={() => {
                        setOpenModal(false);
                        callbacks.poZapisieWprowadzKolejnaPrace();
                    }}
                    positive
                />
                <Button color='black' onClick={() => {
                    setOpenModal(false);
                    window.location.assign('/eoffice/production/raport_prac_zakonczonych.xml?action=list&refreshTree=false&go=false&changetree=false');
                }}>
                    Powrót do listy
                    </Button>
                {/* <Button color='black' onClick={() => {
                    setOpenModal(false);
                }}>
                    Zamknij
                    </Button> */}
            </Modal.Actions>
        </Modal>
    )
}