import '../styles/HistoryCard.css';

const histories = [
    {
        id: 1,
        name: 'Geprek Bensu',
        day: 'Saturday',
        date: '12 March 2021',
        total: 45000,
        status: 'Finished',
    },
];

const TransactionHistory = () => {
    const renderHistories = () => (
        histories.map(({id, name, day, date, total, status}) => (
            <div className='hc__container'>
                <div className='hc__left'>
                    <div className='hc__name'>{ name }</div>
                    <div className='hc__date'>
                        <span>{ day }, </span>
                        { date }
                    </div>
                    <div className='hc__total'>{ `Rp ${total}` }</div>
                </div>
                <div className='hc__right'>
                    <div className='hc__logo'><img src='/assets/logo.svg' alt='Logo'/></div>
                    <div className='hc__status'>{ status }</div>
                </div>
            </div>
        ))
    );
    return (
        <div>
            <div className='app__header'>History Transaction</div>
            <div style={{marginTop: 32}}>
                { renderHistories() }
            </div>
        </div>
    )
}

export default TransactionHistory;
