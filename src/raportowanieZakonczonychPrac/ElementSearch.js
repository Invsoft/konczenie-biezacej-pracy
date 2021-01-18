import React from 'react';
import { Search } from 'semantic-ui-react'
import _ from 'lodash'

export const ElementSearch = ({ params, callbacks }) => {
    const { isLoading, elementyLoading, elementyZlecenia } = params;
    const [searchText, setSearchText] = React.useState('')



    const handleSearchChange = (e, { value }) => {
        setSearchText(value)
        //filrtujPracownikow(pracownicy, value)
    }

    const [value, setValue] = React.useState()
    return (
        <>
            <Search key="elemSearch" className='element_search'
                loading={isLoading || elementyLoading} icon=''
                onResultSelect={(e, data) =>
                    setValue(data.result.id)
                }
                onSearchChange={_.debounce(handleSearchChange, 500, { leading: true })}
                results={elementyZlecenia}
                resultRenderer={resultRenderer}
                value={searchText}
                defaultValue='podaj 3 znaki..'
            />
            {/* onResultSelect={this.handleResultSelect}
                onSearchChange={_.debounce(this.handleSearchChange, 500, { leading: true })}
                resultRenderer={resultRenderer}
                ref={this.searchRef} */}
        </>
    )
}

const resultRenderer = ({ id, index, title }) => (
    <div key={'zlec_rend_' + id} className='content search_result'>
        {index && <span className='title'>{index}</span>}
        {title && <span className='description'>{title}</span>}
    </div>
)
