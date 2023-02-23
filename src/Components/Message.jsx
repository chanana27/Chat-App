import React from 'react'
import { HStack, Avatar, Text } from '@chakra-ui/react'

const Message = ({texttt, uri, user="other"}) => {
  return (
    <HStack bg={"gray.100"} borderRadius={"base"} paddingX={user==="me" ? "2" : "4"} paddingY={"2"} alignSelf={user === "me" ? "flex-end" : "flex-start"}>
        {user === "me" && <Avatar src={uri}/>}
        <Text>{texttt}</Text>
        {user === "other" && <Avatar src={uri}/>}
        
    </HStack>
  )
}

export default Message