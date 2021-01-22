import React from 'react';
import { Icon, Search, Button } from 'semantic-ui-react'
import classNames from 'classnames/bind'
import _ from 'lodash'

export const PracownikSearch = ({ params, callbacks }) => {
    const { isLoading, pracownicy, pracownik, } = params;

    const [pracownicyFilter, setPracownicyFilter] = React.useState(pracownicy)
    React.useEffect(() => { filrtujPracownikow(pracownicy, '')}, [pracownicy])
    const [searchText, setSearchText] = React.useState('')

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
        setSearchText(pracownik.surname + ' ' + pracownik.name)
        callbacks.wybierzPracownika(pracownik)
    }
    const clearSelection = () => {
        callbacks.wybierzPracownika(null)
        setSearchText('')
    }

    return (
        <div className={classNames(
            {
                'fields_group': true,
                'fields_group_niepoprawne_dane': !pracownik,
            })}>
            <Search key="pracownikSearch" className='search_field'
                loading={isLoading} icon=''
                minCharacters={0}
                placeholder='Wpisz nazwisko i wybierz z listy'
                results={pracownicyFilter}
                resultRenderer={resultRenderer}
                onSearchChange={_.debounce(handleSearchChange, 500, { leading: true })}
                onResultSelect={(e, data) => onSelect(data.result)}
                value={searchText}
            >
            </Search>
            <Button icon onClick={(e, data) => clearSelection('')} disabled={!searchText.length > 0} >
                <Icon name='remove circle' />
            </Button> {/* */}
            
            {/* onResultSelect={this.handleResultSelect}
                onSearchChange={_.debounce(this.handleSearchChange, 500, { leading: true })}
                resultRenderer={resultRenderer}
                ref={this.searchRef} /*className='project_info'*/}
            <div className='search_status_info'> 
            {pracownik ?
                <div> 
                    <Icon name="check" color='green' />
                {/* <span className='project_info_title'>{pracownik.surname + ' ' + pracownik.name}</span> {pracownik.wydzial} */}
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

const resultRenderer = ({ emp_id, name, surname, wydzial }) => (
    <div key={'prac_rend_' + emp_id} className='content search_result'>
        {surname && <span className='title'>{surname} {name}</span>}
        {wydzial && <span className='description'>{wydzial}</span>}
    </div>
)
