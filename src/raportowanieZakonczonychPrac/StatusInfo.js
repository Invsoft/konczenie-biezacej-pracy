import { Icon } from 'semantic-ui-react'

export const StatusInfo = ({poprawneDane}) => {
    return (
        <div className='search_status_info'>
            {poprawneDane ?
                <div>
                    <Icon name="check" color='green' />
                </div>
                :
                <div className="blad">
                    {/* Brak */}
                </div>
            }
        </div>
    )
}