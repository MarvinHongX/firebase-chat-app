import React, { Component } from 'react'
import { connect } from 'react-redux'
import ChatMessage from './ChatMessage'
import { setGoToEnd } from '../../../redux/actions/sta_action'
import { getDatabase, ref, onChildAdded, onChildRemoved, child, off } from 'firebase/database'
import ChatMainBodyDetail from './ChatMainBodyDetail'

export class ChatMainBody extends Component {
  constructor(props){
    super(props)
    this.messageEndRef = React.createRef()
  }
  prevGoToEnd = this.props.goToEnd;
  
  state = {
    messages: [],
    messagesRef: ref(getDatabase(), 'messages'),
    messagesLoading: true,
    typingRef: ref(getDatabase(), 'typing'),
    typingUsers: [],
    listenerLists: [],
    isFirst: false,
  }
  
  componentDidMount() {
    const { room } = this.props
    if (!room) return

    this.addMessagesListeners(room.id)
    this.addTypingListeners(room.id)
    this.setState({isFirst: true})
  }
  componentDidUpdate(prevProps) {
    const { goToEnd } = this.props;

    if (prevProps.goToEnd !== goToEnd && this.prevGoToEnd === false && goToEnd === true) {
        this.handleGoToEnd()
        
    }
    if (this.state.isFirst) {
      this.handleGoToEnd()
      this.setState({isFirst: false})
    }
  }
  
  componentWillUnmount(){
    const { messagesRef, listenerLists } = this.state
    off(messagesRef)
    this.removeMessagesListeners(listenerLists)
  }
  

  handleGoToEnd = () => {
    this.messageEndRef?.current?.scrollIntoView(true)
    this.props.dispatch(setGoToEnd(false))
  }

  addMessagesListeners = (roomId) => {
    let messagesArray = []
    let { messagesRef } = this.state
    onChildAdded(child(messagesRef, roomId), DataSnapshot => {
      messagesArray.push(DataSnapshot.val())
      this.setState({
        messages: messagesArray,
        messagesLoading: false
      })
    })
  }



  removeMessagesListeners = (listeners) => {
    listeners.forEach(listener => {
      off(ref(getDatabase(), `messages/${listener.id}`), listener.event)
    })
  }

  addTypingListeners = (roomId) => {
    let typingUsers = []
    let { typingRef } = this.state

    onChildAdded(child(typingRef, roomId), DataSnapshot => {
      if (DataSnapshot.key !== this.props.user.uid) {
        typingUsers = typingUsers.concat({
          id: DataSnapshot.key,
          message: DataSnapshot.val()
        })
        this.setState({ typingUsers })
      }
    })

    this.addToListenerLists(roomId, this.state.typingRef, 'child_added')

    onChildRemoved(child(typingRef, roomId), DataSnapshot => {
      const index = typingUsers.findIndex(user => user.id === DataSnapshot.key)
      if (index !== -1) {
        typingUsers = typingUsers.filter(user => user.id !== DataSnapshot.key)
        this.setState({ typingUsers })
      }
    })

    this.addToListenerLists(roomId, this.state.typingRef, 'child_removed')
  }

  addToListenerLists = (id, ref, event) => {
    const index = this.state.listenerLists.findIndex(listener => {
      return (
        listener.id === id &&
        listener.ref === ref &&
        listener.event === event
      )
    })

    if (index === -1) {
      const newListener = { id, ref, event }
      this.setState({
        listenerLists: this.state.listenerLists.concat(newListener)
      })
    }
  }

  typingMessages = (typingUsers) => {
    let re = []
    typingUsers.length > 0 &&
      typingUsers.map(user => (
        re.push(user.message)
      ))
    return re
  }

  renderTypingUsers = (typingUsers) => {
    const typingMessages = this.typingMessages(typingUsers)
    return (
      this.renderMessages(typingMessages)
    )
  }

  isImage = message => message.hasOwnProperty('image') && !message.hasOwnProperty('content')

  arrangedMessages = (messages) => {
    let userId = ''
    let re = []
    let message = {}
    for (var key in messages) {
      if (messages[key].user.id.substring(0,3) === 'sys') {
        if (Object.keys(message).length !== 0) re.push(message)
        message = {
          userId: messages[key].user.id,
          content: [
            {
              text: messages[key].content,
              image: null,
              timestamp: messages[key].timestamp
            }
          ],
          groupTimestamp: messages[key].timestamp,
          user: messages[key].user,
        }
        userId = messages[key].user.id
      }else {
        if (userId !== messages[key].user.id) {
          if (Object.keys(message).length !== 0) re.push(message)
          message = {}  
          message.content = []  
          userId = messages[key].user.id
        }
        message.content.push(
          {
            text: this.isImage(messages[key]) ? null : messages[key].content,
            image: this.isImage(messages[key]) ? messages[key].image : null,
            timestamp: messages[key].timestamp
          }
        )
        message.groupTimestamp = messages[key].timestamp
        message.user = messages[key].user
      }
    }
  
    if (Object.keys(message).length !== 0) re.push(message)
    
    return re
  }

  renderMessages = (messages) => {
    const arrangedMessages = this.arrangedMessages(messages)
    return (
      arrangedMessages.length > 0 &&
      arrangedMessages.map(message => (
        <ChatMessage 
          key={message.groupTimestamp}
          message={message}
          me={this.props.user}
        />
      ))
    )
  }

  

  searchedMessages = (messages, searchKeyword) => {
    const newMessages = [...messages]
    const regex = new RegExp(searchKeyword, 'gi')

    const searchResults = newMessages.reduce((acc, message) => {
      if (
        (message.content && message.content.match(regex)) || message.user.name.match(regex)
      ) {
        acc.push(message)
      }
      return acc
    }, [])
    return searchResults
  }


  render() {
    const { messages, typingUsers } = this.state
    const { searching, searchKeyword, showDetail, room, windowSize, visualSize } = this.props;
    return (
      <div className='chat-main-body'
        style={{
          marginTop: `${searching ? 0 : windowSize?.height - visualSize?.height}px`,
        }}
      >
        { room  &&
        <div>
          {showDetail ? 
            <ChatMainBodyDetail/>
          :
          this.renderMessages(this.searchedMessages(messages, searchKeyword))
          }
          {this.renderTypingUsers(typingUsers)}

          <div className='chat-main-body-end-ref' ref={this.messageEndRef}
          >
          </div>
        </div>
        }
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    searching: state.sta.searching,
    searchKeyword: state.sta.searchKeyword.value,
    goToEnd: state.sta.goToEnd,
    showDetail: state.sta.showDetail,
    windowSize: state.size.windowSize,
    visualSize: state.size.visualSize,
    user: state.user.currentUser,
    room: state.room.currentRoom
  }
}

export default connect(mapStateToProps)(ChatMainBody)
