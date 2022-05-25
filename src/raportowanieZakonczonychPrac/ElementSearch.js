import React from 'react';
import { Search, Button, Icon } from 'semantic-ui-react'
import classNames from 'classnames/bind'
import _ from 'lodash'
import { StatusInfo} from "./StatusInfo";

export const ElementSearch = ({ params, callbacks }) => {
    const { isLoading, elementyLoading, elementyZlecenia, elementWybrany, refElement } = params;
    const [searchText, setSearchText] = React.useState('')
    React.useEffect(() => {
        if (!elementWybrany) setSearchText('')
        else setSearchText(elementWybrany.object_index + ' ' + elementWybrany.title)
    }, [elementWybrany])

    const handleSearchChange = (e, { value }) => {
        //setSearchText(value)
        //filrtujPracownikow(pracownicy, value)
    }
    const onSelect = (element) => {
        callbacks.wybierzElement(element)
        //setSearchText(element.object_index +' '+ element.title)
    }
    const clearSelection = () => {
        callbacks.wybierzElement(null)
        setSearchText('')
    }

    return (
        <div className={classNames(
            {
                'fields_group': true,
                'fields_group_niepoprawne_dane': !elementWybrany,
            })}>
            <Search key="elemSearch" className='search_field'
                loading={isLoading || elementyLoading} icon=''
                ref={refElement}
                minCharacters={0}
                placeholder={elementyZlecenia.length == 0 ? 'najpierw wskaż zlecenie' : 'kliknij by wybierać z listy'}
                results={elementyZlecenia}
                resultRenderer={resultRenderer}
                onSearchChange={_.debounce(handleSearchChange, 500, { leading: true })}
                onResultSelect={(e, data) => onSelect(data.result) }
                value={searchText}
            />
            <Button icon onClick={(e, data) => clearSelection()} disabled={!searchText.length > 0}>
                <Icon name='remove circle' />
            </Button>
            <StatusInfo poprawneDane={elementWybrany} />
            {/* {elementWybrany &&
                <div className='project_info'>
                <span className='project_info_title'>{elementWybrany.object_index}</span>
                {elementWybrany.title}
                </div>
            } */}
        </div>
    )
}

const resultRenderer = ({ id, object_index, title }) => (
    <div key={'zlec_rend_' + id} className='content search_result'>
        {object_index && <span className='title'>{object_index}</span>}
        {title && <span className='description'>{title}</span>}
    </div>
)
