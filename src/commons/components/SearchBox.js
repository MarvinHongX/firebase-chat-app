import React from 'react'
import { AiOutlineSearch } from 'react-icons/ai'
import styled from 'styled-components'

const SearchWrapper = styled.div`
  height: 35px;
  width: 100%;
  border-radius: 20px;
  padding-left: 13px;
  color: #8E8E8E;
  /* background-color: white; */
  border: 1px solid #dedada;
  outline: none;
  display: flex;
  flex-direction: row;
`
const SearchIcon = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`

const SearchInput = styled.input`
  width: 100%;
  padding-left: 13px;
  padding-right: 13px;
  border: 0;
  background-color: transparent;
  outline: none;
`

export default function SearchBox({handleSearchChange}) {
  return (
    <SearchWrapper>
    <SearchIcon>
      <AiOutlineSearch size='25px'/>
    </SearchIcon>
    <SearchInput
      name='content' 
      type='text'
      placeholder='Search'
      onChange={handleSearchChange}
      autoComplete='off'
    />
  </SearchWrapper>
  )
}
