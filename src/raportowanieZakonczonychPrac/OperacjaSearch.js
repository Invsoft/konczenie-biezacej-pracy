import React from 'react';
import { Search, Button, Icon } from 'semantic-ui-react'
import classNames from 'classnames/bind'
import _ from 'lodash'
import { StatusInfo } from "./StatusInfo";

export const OperacjaSearch = ({ params, callbacks }) => {
    const { isLoading, operacjeLoading, operacje, operacjaWybrana, refOperacja } = params;
    const [searchText, setSearchText] = React.useState('')
    React.useEffect(() => {
        if (!operacjaWybrana) setSearchText('')
    }, [operacjaWybrana])
    const handleSearchChange = (e, { value }) => {
        //setSearchText(value)
    }
    const onSelect = (operacja) => {
        callbacks.wybierzOperacje(operacja)
        setSearchText(operacja.value)
    }
    const clearSelection = () => {
        callbacks.wybierzOperacje(null)
        setSearchText('')
    }

    return (
        <div className={classNames(
            {
                'fields_group': true,
                'fields_group_niepoprawne_dane': !operacjaWybrana,
            })}>
            <Search key="operSearch" className='search_field'
                loading={isLoading || operacjeLoading} icon=''
                ref={refOperacja}
                minCharacters={0}
                placeholder={operacje.length == 0 ? 'najpierw wskaż element' : 'kliknij by wybierać z listy'}
                results={operacje}
                resultRenderer={resultRenderer}
                onSearchChange={_.debounce(handleSearchChange, 500, { leading: true })}
                onResultSelect={(e, data) => onSelect(data.result)}
                value={searchText}
            />
            <Button icon onClick={(e, data) => clearSelection()} disabled={!searchText.length > 0}>
                <Icon name='remove circle' />
            </Button>
            <StatusInfo poprawneDane={operacjaWybrana} />
            {/* {operacjaWybrana &&
                <div className='project_info'>
                <span className='project_info_title'>{operacjaWybrana.value}</span>
                </div>
            } */}
        </div>
    )
}

const resultRenderer = ({ id, value }) => (
    <div key={'zlec_rend_' + id} className='content search_result'>
        {value && <span className='title'>{value}</span>}
    </div>
)
