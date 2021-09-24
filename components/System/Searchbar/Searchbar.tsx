import { SearchIcon } from '@heroicons/react/outline'
import { FC, useState } from 'react'
import { StyledSearchbar } from '.'
import { Icon } from '..'

type Props = {
  placeholder?: string
}

const Searchbar: FC<Props> = ({ placeholder }) => {
  const [input, setInput] = useState("")

  return (
    <StyledSearchbar>
      <Icon size={24}>
        <SearchIcon />
      </Icon>
      <input 
        type="text" 
        placeholder={placeholder ? placeholder : 'Search players'} 
        onChange={(e) => setInput(e.currentTarget.value)} 
      />
    </StyledSearchbar>
  )
}

export default Searchbar