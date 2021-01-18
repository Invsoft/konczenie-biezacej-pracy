import React from 'react';
import { Search } from 'semantic-ui-react'
import _ from 'lodash'
import { consts } from './consts'

export const ZlecenieSearch = ({ params, callbacks }) => {
    const { isLoading, zlecenieWybrane, pracownicy, pracownik } = params;
    const [searchText, setSearchText] = React.useState('')

    const [zleceniaLoading, setZleceniaLoading] = React.useState(false)
    const [zleceniaLista, setZleceniaLista] = React.useState([])

    React.useEffect(() => {
        loadZlecenia(searchText)
    }, [searchText])

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

    const handleBlur = (e, data) => {
        console.log('ZlecenieSearch.handleBlur')
    }
    return (
        <div className="zlecenie_fields">
            <Search key="zlecSearch" className='zlecenie_search'
                loading={isLoading || zleceniaLoading} icon=''
                onResultSelect={(e, data) =>
                    callbacks.wybierzZlecenie(data.result)
                }
                onSearchChange={_.debounce(handleSearchChange, 500, { leading: true })}
                results={zleceniaLista}
                resultRenderer={resultRenderer}
                value={searchText}
                placeholder='Wpisz indeks lub tytuł...'
                onBlur={handleBlur}
            />
            {/* onResultSelect={this.handleResultSelect}
                onSearchChange={_.debounce(this.handleSearchChange, 500, { leading: true })}
                resultRenderer={resultRenderer}
                ref={this.searchRef} */}

            {zlecenieWybrane && 
            <div className='project_info'>
                <span className='project_info_title'>{zlecenieWybrane.object_index}</span>
                {zlecenieWybrane.title}
            </div>
}
        </div>
    )
}

const resultRenderer = ({ id, index, title }) => (
    <div key={'zlec_rend_' + id} className='content search_result'>
        {index && <span className='title'>{index}</span>}
        {title && <span className='description'>{title}</span>}
    </div>
)
