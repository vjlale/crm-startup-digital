import ChatList from '../components/ChatList.jsx'
import ChatWindow from '../components/ChatWindow.jsx'
import LeadPanel from '../components/LeadPanel.jsx'

export default function Inbox() {
  return (
    <div className="flex h-full">
      <ChatList />
      <ChatWindow />
      <LeadPanel />
    </div>
  )
}
