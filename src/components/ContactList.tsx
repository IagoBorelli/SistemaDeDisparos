
import { List, UserCircle, Trash } from 'phosphor-react';
import type { Contact } from '../types/contact';

interface ContactListProps {
  contacts: Contact[];
  onDeleteContact: (id: string) => void;
}

export function ContactList({ contacts, onDeleteContact }: ContactListProps) {
  return (
    <div className="bg-card rounded-lg p-6 mt-6">
      <div className="flex items-center justify-between mb-4">
        {/* Cabeçalho */}
        <h2 className="text-lg font-semibold text-text-primary flex items-center gap-2">
          <List size={24} className="text-action-primary" />
          Lista de Contatos
        </h2>
        <span className="bg-action-primary text-white text-xs font-semibold px-2.5 py-0.5 rounded-full">
          {contacts.length} contatos
        </span>
      </div>

      {/* Conteúdo */}
      <div>
        {contacts.length === 0 ? (
          // Estado Vazio
          <div className="flex flex-col items-center justify-center text-center text-text-secondary py-16">
            <UserCircle size={48} className="mb-2" />
            <p className="font-medium text-text-primary">Nenhum contato adicionado ainda</p>
            <p className="text-sm">Adicione contatos usando o formulário acima ou importe um arquivo CSV</p>
          </div>
        ) : (
          // Tabela de Contatos
          <table className="w-full table-auto text-left">
            <thead>
              <tr className="border-b border-border-color">
                <th className="p-2 text-sm font-semibold text-text-secondary">Nome Completo</th>
                <th className="p-2 text-sm font-semibold text-text-secondary">CPF</th>
                <th className="p-2 text-sm font-semibold text-text-secondary">Número WhatsApp</th>
                <th className="p-2 text-sm font-semibold text-text-secondary">Ações</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((contact) => (
                <tr key={contact.id} className="border-b border-input-bg hover:bg-input-bg">
                  <td className="p-2 text-text-primary">{contact.nome}</td>
                  <td className="p-2 text-text-secondary">{contact.cpf || 'N/A'}</td>
                  <td className="p-2 text-text-secondary">{contact.numero}</td>
                  <td className="p-2">
                    <button 
                      onClick={() => onDeleteContact(contact.id)}
                      className="text-red-500 hover:text-red-400"
                    >
                      <Trash size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}