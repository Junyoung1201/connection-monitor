import { useSelector } from 'react-redux';
import './Search.css';
import { RootState, store } from 'store/store';
import React from 'react';
import { setSearch } from 'store/connection';

export default function Search() {

    const {search} = useSelector((state: RootState) => state.connection);

    function onChange(e: React.ChangeEvent<HTMLInputElement>) {
        store.dispatch(setSearch(e.target.value));
    }

    return <div className="search">
        <img src="/img/search.png" alt="검색 아이콘" />
        <input type="text" placeholder="검색어" autoComplete='off' spellCheck={false} onChange={onChange} value={search ?? ""} />
    </div>
}