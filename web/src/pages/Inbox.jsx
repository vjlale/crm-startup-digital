import { useState } from 'react'
import ChatList from '../components/ChatList.jsx'
import ChatWindow from '../components/ChatWindow.jsx'
import LeadPanel from '../components/LeadPanel.jsx'
import { useStore } from '../store/useStore.js'

export default function Inbox() {
  const activeId = useStore((s) => s.activeId)
  const [showLead, setShowLead] = useState(false)

  return (
    <div className="flex h-full">
      {/* Lista de chats: ancho completo en móvil, oculta cuando hay un chat abierto */}
      <div className={`${activeId ? 'hidden md:flex' : 'flex'} h-full w-full shrink-0 md:w-80`}>
        <ChatList />
      </div>

      {/* Conversación: full en móvil cuando hay chat; placeholder en desktop */}
      <div className={`${activeId ? 'flex' : 'hidden md:flex'} h-full min-w-0 flex-1`}>
        <ChatWindow onOpenLead={() => setShowLead(true)} />
      </div>

      {/* Panel CRM: inline en desktop, panel deslizable en móvil/tablet */}
      <LeadPanel open={showLead} onClose={() => setShowLead(false)} />
    </div>
  )
}
