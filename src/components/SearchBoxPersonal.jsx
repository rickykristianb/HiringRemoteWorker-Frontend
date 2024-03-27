import SearchBarContext from 'Context/SearchBarContext'
import React, { useContext } from 'react'
import Backdrop from './Backdrop'

const SearchBoxPersonal = (props) => {

    let {
        searchBarEmpTypeData,
        searchBarSkillsData,
        searchBarLocationData,
        isSearchBarOpen,
        onSearchKeyJobEnter,
        onClickedSearchJobItem,
        searchJobBarValue,
        onChangeSearchJobBox,
        backdropSearchJobActive
    } = useContext(SearchBarContext)

  return (
    <div>
        <input
            className='md:w-[500px] max-sm:w-[150px] border-soft-basic border-2 h-12 rounded-xl max-sm:focus:w-[284px] transition-width duration-300 ease-in origin-right outline-none'
            placeholder='Skill, Job Type, Location' 
            value={searchJobBarValue}
            onChange={onChangeSearchJobBox}
            onKeyDown={onSearchKeyJobEnter}
            onFocus={props.focus}
            onBlur={props.blur}
        />

        {isSearchBarOpen && (
            <ul className='z-10 mt-1 ml-5 absolute flex justify-center flex-col p-2 bg-white md:w-[460px] max-md:-left-[20px] max-md:w-full rounded-lg border-dark-basic shadow-lg'>
                {searchBarSkillsData.length !== 0 && (
                    <>
                        <li className='bg-soft-basic border-1 p-2 italic'>Skills</li>
                        <div className='skill-div'>
                            {searchBarSkillsData.slice(0, 3).map((item) => {
                                return <li className='searchResultList-item' onClick={ () => onClickedSearchJobItem({item: item, page:1}) } >{item}</li>
                            })}
                        </div>
                    </>                                   
                )}

                {searchBarEmpTypeData.length !== 0 && (
                    <>
                        <li className='bg-soft-basic border-1 p-2 italic'>Job Type</li>
                        <div className='skill-div'>
                            {searchBarEmpTypeData.slice(0, 3).map((item) => {
                                return <li className='searchResultList-item' onClick={ () => onClickedSearchJobItem({item: item, page:1}) } >{item}</li>
                            })}
                        </div>
                    </>
                )}

                {searchBarLocationData.length !== 0 && (
                    <>
                        <li className='bg-soft-basic border-1 p-2 italic'>Location</li>
                        <div className='skill-div'>
                            {searchBarLocationData.slice(0, 3).map((item) => {
                                return <li className='searchResultList-item' onClick={ () => onClickedSearchJobItem({item: item, page:1}) } >{item}</li>
                            })}
                        </div>   
                    </>
                )}
            </ul>
            )}

        {backdropSearchJobActive && <Backdrop />}
    </div>
  )
}

export default SearchBoxPersonal