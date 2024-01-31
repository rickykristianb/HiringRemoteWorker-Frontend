import { createContext, useState} from "react";

const AdvanceFilterContext = createContext();

export default AdvanceFilterContext;

export const AdvanceFilterProvider = ({children}) => {

    const [filterUserClicked, setFilterUserClicked] = useState(false)
    const [filterJobClicked, setFilterJobClicked] = useState(false)

    const onAdvanceFilterUserClick = () => {
        // FOR COMPANY
        if (filterUserClicked === false) {
            setFilterUserClicked(true)
        } else {
            setFilterUserClicked(false)
        }
    }

    const onAdvanceFilterJobClick = () => {
        // FOR PERSONAL
        if (filterJobClicked === false) {
            setFilterJobClicked(true)
        } else {
            setFilterJobClicked(false)
        }
    }
    

    let contextData = {
        onAdvanceFilterUserClick,
        onAdvanceFilterJobClick,
        filterUserClicked,
        filterJobClicked
    }

    return (
        <AdvanceFilterContext.Provider value={contextData}>
            {children}
        </AdvanceFilterContext.Provider>
    )
}