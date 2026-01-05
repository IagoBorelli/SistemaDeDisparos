import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Contact } from '../types/contact';

interface MessageState {
  // Mensagem
  selectedMessage: string;
  setSelectedMessage: (message: string) => void;
  
  // Contatos
  contacts: Contact[];
  addContact: (contact: Contact) => void;
  addContacts: (contacts: Contact[]) => void;
  removeContact: (id: string) => void;
  clearContacts: () => void;
}

// Usamos o middleware 'persist' para salvar tudo automaticamente no navegador
export const useMessageStore = create<MessageState>()(
  persist(
    (set) => ({
      // Estado inicial
      selectedMessage: '',
      contacts: [],

      // Actions (Funções para modificar o estado)
      setSelectedMessage: (message) => set({ selectedMessage: message }),
      
      addContact: (contact) => set((state) => ({ 
        contacts: [contact, ...state.contacts] 
      })),
      
      addContacts: (newContacts) => set((state) => ({ 
        contacts: [...newContacts, ...state.contacts] 
      })),
      
      removeContact: (id) => set((state) => ({ 
        contacts: state.contacts.filter((c) => c.id !== id) 
      })),
      
      clearContacts: () => set({ contacts: [] }),
    }),
    {
      name: 'chatpulse-storage', // Nome chave no localStorage
      storage: createJSONStorage(() => localStorage),
    }
  )
);