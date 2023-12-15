import React, { useEffect, useState } from 'react'
import TuneIcon from '@mui/icons-material/Tune';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Zoom from '@mui/material/Zoom';
import Box from '@mui/material/Box';
import FilterBar from './FilterBar';
import UsersList from './UsersList';

const Search = () => {
    const [filterClicked, setFilterClicked] = useState(false)

    const [selectedSkills, setSelectedSkills] = useState([])

    const onFilterClick = () => {
        if (filterClicked === false) {
            setFilterClicked(true)
        } else {
            setFilterClicked(false)
        }
    }

  return (
        <div className='container-search'>
             { filterClicked && (
                <FilterBar barClicked={ onFilterClick }/>
            )}
            <div className='search-menu'>
                <div className='search-input'>
                    <ul>
                        <li>
                        <Box
                            sx={{
                                width: 500,
                                maxWidth: '100%',
                            }}
                            >
                            <TextField fullWidth label="Skill, Job Type, Location" id="fullWidth" InputProps={{
                                style: {
                                    borderRadius: '30px',
                                    boxShadow: '0 2px 5px 0px rgba(78, 110, 110, 0.3)',
                                }
                            }}/>
                        </Box></li>
                        <li className='icon-search'><PersonSearchIcon sx={{ fontSize: 50, color: "#4e6e81" }} /></li>
                        <Tooltip  TransitionComponent={Zoom} placement="right" title="Filter" arrow>
                            <li className='icon-search' onClick={ onFilterClick }><TuneIcon sx={{ fontSize: 50, color: "#4e6e81" }} /></li>
                        </Tooltip>
                    </ul>
                </div>     
                <UsersList filterClicked = {filterClicked} />
            </div>
        </div>
  )
}

export default Search