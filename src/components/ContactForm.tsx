import { UserPlus } from 'phosphor-react';
import { useState, useRef } from 'react';
import { useMessageStore } from '../store/messageStore';

export function ContactForm() {
  
  const addContact = useMessageStore((state) => state.addContact);
  

  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [numero, setNumero] = useState('');
  
  const nomeInputRef = useRef<HTMLInputElement>(null);

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ''); 
    if (value.length > 11) value = value.slice(0, 11); 
    
    
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d{1,2})/, '$1-$2');
    
    setCpf(value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!nome.trim() || !numero.trim()) return;
    
    addContact({
      id: crypto.randomUUID(),
      nome,
      cpf,
      numero,
    });

    setNome('');
    setCpf('');
    setNumero('');
    
    setTimeout(() => {
      if (nomeInputRef.current) {
        nomeInputRef.current.focus();
      }
    }, 50);
  };

  return (
    <div className="bg-card rounded-lg p-6 shadow-sm border border-border-color/10">
      <h2 className="text-lg font-semibold text-text-primary flex items-center gap-2 mb-6">
        <UserPlus size={24} className="text-action-primary" weight="fill" />
        Adicionar Novo Contacto
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Campo Nome */}
          <div className="flex flex-col">
            <label htmlFor="nome" className="mb-1.5 text-sm font-medium text-text-secondary">
              Nome Completo <span className="text-red-400">*</span>
            </label>
            <input
              ref={nomeInputRef}
              type="text"
              id="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full rounded-md border border-border-color bg-input-bg px-4 py-2.5 text-text-primary placeholder-text-secondary/50 transition-all focus:border-action-primary focus:outline-none focus:ring-1 focus:ring-action-primary"
              placeholder="Ex: Maria Silva"
              required
              autoComplete="off"
            />
          </div>

          {/* Campo CPF */}
          <div className="flex flex-col">
            <label htmlFor="cpf" className="mb-1.5 text-sm font-medium text-text-secondary">
              CPF
            </label>
            <input
              type="text"
              id="cpf"
              value={cpf}
              onChange={handleCpfChange}
              className="w-full rounded-md border border-border-color bg-input-bg px-4 py-2.5 text-text-primary placeholder-text-secondary/50 transition-all focus:border-action-primary focus:outline-none focus:ring-1 focus:ring-action-primary"
              placeholder="000.000.000-00"
              autoComplete="off"
            />
          </div>

          {/* Campo WhatsApp */}
          <div className="flex flex-col">
            <label htmlFor="numero" className="mb-1.5 text-sm font-medium text-text-secondary">
              WhatsApp <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              id="numero"
              value={numero}
              onChange={(e) => setNumero(e.target.value)}
              className="w-full rounded-md border border-border-color bg-input-bg px-4 py-2.5 text-text-primary placeholder-text-secondary/50 transition-all focus:border-action-primary focus:outline-none focus:ring-1 focus:ring-action-primary"
              placeholder="5511999998888"
              required
              autoComplete="off"
            />
            <span className="mt-1 text-xs text-text-secondary/70">
              Inclua o código do país (ex: 55 para Brasil) e não utilize o nove da frente
            </span>
          </div>
        </div>

        {/* Botão de Adicionar */}
        <div className="flex justify-start pt-2">
          <button
            type="submit"
            className="flex items-center gap-2 rounded-md bg-action-secondary px-6 py-2.5 font-semibold text-white transition-all hover:bg-action-secondary-hover active:scale-95"
          >
            <UserPlus size={20} weight="bold" />
            Adicionar à Lista
          </button>
        </div>
      </form>
    </div>
  );
}