import React from 'react';
import { Search, Button, Icon } from 'semantic-ui-react'
import classNames from 'classnames/bind'
import _ from 'lodash'
import { consts } from './DataProvider'

export const ZlecenieSearch = ({ params, callbacks }) => {
    const { isLoading, zlecenieWybrane, refZlecenie, } = params;
    const [searchText, setSearchText] = React.useState('')

    const [zleceniaLoading, setZleceniaLoading] = React.useState(false)
    const [zleceniaLista, setZleceniaLista] = React.useState([])

    React.useEffect(() => {
        loadZlecenia(searchText)
    }, [searchText])
    React.useEffect(() => {
        if (zlecenieWybrane == null) setSearchText('')
    }, [zlecenieWybrane])

    async function loadZlecenia(searchText) {
        setZleceniaLoading(true)
        const jsonName = consts.ENDPOINT_URL +'?action=pobierz_zlecenia_produkcyjne_json&q=' + searchText
        const response = await fetch(jsonName);
        const myJson = await response.json();
        //console.log('myJson', myJson)
        setZleceniaLista(myJson)
        setZleceniaLoading(false)
    }

    const handleSearchChange = (e, { value }) => {
        setSearchText(value)
        //filrtujPracownikow(pracownicy, value)
    }
    const onSelect = (zlecenie) => {
        callbacks.wybierzZlecenie(zlecenie)
        setSearchText(zlecenie.index + ' ' + zlecenie.title)
    }
    const clearSelection = () => {
        callbacks.wybierzZlecenie(null)
        setSearchText('')
    }
    const handleBlur = (e, data) => {
        console.log('ZlecenieSearch.handleBlur')
    }
    return (
        <div className={classNames(
            {
                'fields_group': true,
                'fields_group_niepoprawne_dane': !zlecenieWybrane,
            })}>
            <Search key="zlecSearch" id='zlecenie_search' className='search_field'
                loading={isLoading || zleceniaLoading} icon=''
                ref={refZlecenie}
                placeholder='Wpisz indeks lub tytuł (min 3 znaki)'
                results={zleceniaLista}
                resultRenderer={resultRenderer}
                onSearchChange={_.debounce(handleSearchChange, 500, { leading: true })}
                onResultSelect={(e, data) => onSelect(data.result)}
                value={searchText}
                onBlur={handleBlur}
            />
            <Button icon onClick={(e, data) => clearSelection('')} disabled={!searchText.length > 0}>
                <Icon name='remove circle' />
            </Button>
            <div className='search_status_info'>
                {zlecenieWybrane ?
                    <div>
                        <Icon name="check" color='green' />
                        {/* <span className='project_info_title'>{zlecenieWybrane.index}</span> {zlecenieWybrane.title} */}
                    </div>
                    :
                    <div className="blad">
                        {/* Brak */}
                    </div>
                }
            </div>
        </div>
    )
}

const resultRenderer = ({ id, index, title }) => (
    <div key={'zlec_rend_' + id} className='content search_result'>
        {index && <span className='title'>{index}</span>}
        {title && <span className='description'>{title}</span>}
    </div>
)
