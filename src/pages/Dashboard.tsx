import { useState } from 'react';
import { PaperPlaneRight } from 'phosphor-react';
import { useMessageStore } from '../store/messageStore';
import { ContactForm } from '../components/ContactForm';
import { CsvDropzone } from '../components/CsvDropzone';
import { ContactList } from '../components/ContactList';
import { toast } from 'react-hot-toast';
import { db } from '../db'; 
import type { Contact } from '../types/contact'; 
import { useQueryClient } from '@tanstack/react-query';

export function Dashboard() {
  const [isSending, setIsSending] = useState(false);
  const queryClient = useQueryClient(); 
  const contacts = useMessageStore((state) => state.contacts);
  const selectedMessage = useMessageStore((state) => state.selectedMessage);
  const removeContact = useMessageStore((state) => state.removeContact);
  const clearContacts = useMessageStore((state) => state.clearContacts);

  
  const handleSendMessages = async () => {
   
    if (!selectedMessage || selectedMessage.trim() === '') {
      toast.error('Nenhuma mensagem selecionada. Vá à aba "Mensagens" e selecione um template.');
      return;
    }

    if (contacts.length === 0) {
      toast.error('Adicione pelo menos um contacto antes de disparar.');
      return;
    }

    setIsSending(true);

    const loadingToast = toast.loading('A disparar mensagens...');

    try {
      
      const response = await fetch('https://vm-n8n.xyrugy.easypanel.host/webhook-test/fundat', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: selectedMessage,
          contacts: contacts,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Falha no servidor');
      }

      
      let reportArray: any[] | undefined = undefined;

      if (result.report && Array.isArray(result.report)) {
        
        reportArray = result.report;
      } else if (result.data && result.data.success && Array.isArray(result.data.success)) {
        
        reportArray = result.data.success;
      } else if (result.success && Array.isArray(result.success)) {
       
        reportArray = result.success;
      }

      
      if (reportArray) {
        
        toast.success(`Sucesso! ${reportArray.length} mensagens processadas.`, {
          id: loadingToast,
        });

       
        const logEntries = contacts.map((contact: Contact) => ({
          contact: contact,
          timestamp: new Date()
        }));
        await db.dispatchLog.bulkAdd(logEntries);

        queryClient.invalidateQueries({ queryKey: ['dispatchLog'] });

        
        clearContacts();

      } else {
        
        console.error("Resposta inesperada da API (chaves 'report', 'data' ou 'success' em falta ou mal formatadas):", result);
        throw new Error("A API retornou uma resposta inesperada.");
      }
      

    } catch (error: any) {
      console.error(error);
      
      toast.error(
        `Erro ao disparar: ${error.message}.`,
        { id: loadingToast }
      );
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto pb-12">
      <h1 className="text-3xl font-bold text-text-primary">Gerir Contactos</h1>
      <p className="text-text-secondary mt-1">
        Adicione contactos manualmente ou importe um ficheiro CSV
      </p>

     
      <div className="mt-4 p-3 bg-card border-l-4 border-action-primary rounded text-sm flex justify-between items-center shadow-sm">
        <span className="text-text-secondary">
          Mensagem atual preparada para envio:{' '}
          <strong className="text-text-primary ml-2">
            {selectedMessage
              ? selectedMessage.length > 50
                ? selectedMessage.substring(0, 50) + '...'
                : selectedMessage
              : '(Nenhuma mensagem definida)'}
          </strong>
        </span>
        {!selectedMessage && (
          <span className="text-red-400 font-semibold animate-pulse">
            ⚠ Necessário definir na aba Mensagens
          </span>
        )}
      </div>

      <div className="mt-6 space-y-6">
        
        <ContactForm />

        <div className="flex items-center justify-center">
          <span className="text-text-secondary font-medium">OU</span>
        </div>

       
        <CsvDropzone />
      </div>

     
      <ContactList 
        contacts={contacts} 
        onDeleteContact={removeContact} 
      />

    
      {contacts.length > 0 && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={handleSendMessages}
            disabled={isSending || !selectedMessage}
            className="flex items-center gap-2 bg-action-primary hover:bg-action-primary-hover text-white font-bold px-8 py-3 rounded-lg text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
          >
            <PaperPlaneRight size={24} weight="bold" />
            {isSending
              ? 'A enviar...'
              : `Disparar para ${contacts.length} contactos`}
          </button>
        </div>
      )}
    </div>
  );
}