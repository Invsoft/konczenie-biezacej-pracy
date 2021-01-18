import React from 'react';
import { Search } from 'semantic-ui-react'
import _ from 'lodash'

export const PracownikSearch = ({ params, callbacks }) => {
    const { isLoading, pracownicy, pracownik, wybierzPracownika } = params;

    const [pracownicyFilter, setPracownicyFilter] = React.useState(pracownicy)
    React.useEffect(() => { filrtujPracownikow(pracownicy, '')}, [pracownicy])
    const [searchText, setSearchText] = React.useState()

    const filrtujPracownikow = (pracownicy, filterText) => {
        const re = new RegExp(_.escapeRegExp(filterText), 'i')
        const isMatch = pracownik => filterText === '' ||
            re.test(pracownik.name) || re.test(pracownik.surname)
        setPracownicyFilter(_.filter(pracownicy, isMatch))
        //this.setState({ isLoading: false, results: _.filter(pracownicy, isMatch) })
    }

    const handleSearchChange = (e, { value }) => {
        setSearchText(value)
        filrtujPracownikow(pracownicy, value)
    }

    const onSelect = (pracownik) => {
        console.log('PracownikSearch onSelect', pracownik, callbacks)
        callbacks.wybierzPracownika(pracownik.id)
    }

    return (
        <div className="zlecenie_fields">
            <Search key="pracownikSearch"
                loading={isLoading} icon='search'
                minCharacters={0}
                onResultSelect={(e, data) =>
                    onSelect(data.result)
                }
                onSearchChange={_.debounce(handleSearchChange, 500, { leading: true })}
                results={pracownicyFilter}
                resultRenderer={resultRenderer}
                value={searchText}
            />
            {/* onResultSelect={this.handleResultSelect}
                onSearchChange={_.debounce(this.handleSearchChange, 500, { leading: true })}
                resultRenderer={resultRenderer}
                ref={this.searchRef} */}
            {pracownik ?
             <div className='project_info'>
                <span className='project_info_title'>{pracownik.surname + ' ' + pracownik.name}</span>
                {pracownik.wydzial}
            </div>
            :
            <div className="blad">
                Brak
            </div>
            }
        </div>
    )
}

const resultRenderer = ({ emp_id, name, surname, wydzial }) => (
    <div key={'prac_rend_' + emp_id} className='content search_result'>
        {surname && <span className='title'>{name} {surname}</span>}
        {emp_id && <span className='title'>{emp_id}</span>}
        {wydzial && <span className='description'>{wydzial}</span>}
    </div>
)
