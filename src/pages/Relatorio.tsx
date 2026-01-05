import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { db, type DispatchLogEntry } from '../db';
import { MagnifyingGlass, UserCircle, ChartBar } from 'phosphor-react';
import type { Contact } from '../types/contact'; 

function formatarData(data: Date) {
  if (!data || !(data instanceof Date)) {
    return 'Data inválida';
  }
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(data);
}

export function Relatorio() {

  const [filtroNome, setFiltroNome] = useState('');
  const [filtroCpf, setFiltroCpf] = useState('');
  const { data: logs = [], isLoading } = useQuery({
    queryKey: ['dispatchLog'], 
    queryFn: async () => {
     
      return await db.dispatchLog.orderBy('timestamp').reverse().toArray();
    }
  });

  const logsFiltrados = useMemo(() => {
    return logs.filter(log => {
      if (!log.contact) return false; 
      const nomeMatch = filtroNome
        ? log.contact.nome.toLowerCase().includes(filtroNome.toLowerCase())
        : true;
      
      const cpfMatch = filtroCpf
        ? (log.contact.cpf || '').toLowerCase().includes(filtroCpf.toLowerCase())
        : true;
        
      return nomeMatch && cpfMatch;
    });
  }, [logs, filtroNome, filtroCpf]); 

  return (
    <div className="w-full max-w-7xl mx-auto pb-12">
      <h1 className="text-3xl font-bold text-text-primary flex items-center gap-2">
        <ChartBar weight="fill" className="text-action-primary" />
        Relatório dos Envios
      </h1>
      <p className="text-text-secondary mt-1">
        Visualize o histórico de contactos para quem as mensagens foram disparadas.
      </p>

      
      <div className="mt-6 bg-card rounded-lg p-6 shadow-sm border border-border-color/10">
        <h2 className="text-lg font-semibold text-text-primary flex items-center gap-2 mb-4">
          <MagnifyingGlass size={22} className="text-action-primary" />
          Filtrar Relatórios
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
       
          <div>
            <label htmlFor="filtroNome" className="block text-sm font-medium text-text-secondary mb-1.5">
              Filtrar por Nome
            </label>
            <input
              type="text"
              id="filtroNome"
              value={filtroNome}
              onChange={(e) => setFiltroNome(e.target.value)}
              className="w-full bg-input-bg border border-border-color text-text-primary rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-action-primary"
              placeholder="Digite o nome..."
              autoComplete="off"
            />
          </div>
        
          <div>
            <label htmlFor="filtroCpf" className="block text-sm font-medium text-text-secondary mb-1.5">
              Filtrar por CPF
            </label>
            <input
              type="text"
              id="filtroCpf"
              value={filtroCpf}
              onChange={(e) => setFiltroCpf(e.target.value)}
              className="w-full bg-input-bg border border-border-color text-text-primary rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-action-primary"
              placeholder="Digite o CPF..."
              autoComplete="off"
            />
          </div>
        </div>
      </div>

   
      <div className="mt-6">
        <h3 className="text-text-secondary font-semibold mb-3">
          {isLoading 
            ? "A carregar registos..." 
            : `${logsFiltrados.length} registos encontrados`
          }
        </h3>
        
        {isLoading && (
          <div className="bg-card rounded-lg p-6 text-center text-text-secondary animate-pulse">
            A carregar...
          </div>
        )}

        {!isLoading && logsFiltrados.length === 0 && (
          <div className="bg-card rounded-lg p-12 text-center text-text-secondary flex flex-col items-center opacity-70">
            <UserCircle size={40} weight="thin" className="mb-2" />
            <p>
              {logs.length === 0
                ? "Nenhum envio foi registado ainda."
                : "Nenhum registo encontrado para os filtros aplicados."
              }
            </p>
          </div>
        )}

       
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {logsFiltrados.map((log) => (
            <div 
              key={log.id} 
              className="bg-card rounded-lg p-5 shadow-sm border border-border-color/10 flex flex-col gap-2 transition-all hover:border-action-primary/50"
            >
              <span className="text-xs font-medium text-action-primary bg-input-bg px-2 py-0.5 rounded-full self-start">
                Enviado em: {formatarData(log.timestamp)}
              </span>
              <h3 className="text-lg font-semibold text-text-primary truncate">
                {log.contact.nome}
              </h3>
              <p className="text-sm text-text-secondary">
                <strong className="text-text-primary/80">CPF:</strong> {log.contact.cpf || "N/A"}
              </p> 
             
              <p className="text-sm text-text-secondary">
                <strong className="text-text-primary/80">WhatsApp:</strong> {log.contact.numero}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}