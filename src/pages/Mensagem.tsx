import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ChatCircle, FloppyDisk, Trash, CheckCircle, PlusCircle } from 'phosphor-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useMessageStore } from '../store/messageStore';
import { db, type MessageTemplate } from '../db';
import toast from 'react-hot-toast';

interface MessageFormData {
  title: string;
  text: string;
}

export function Mensagem() {
  const [selectedTemplateId, setSelectedTemplateId] = useState<number | null>(null);
  
  const setSelectedMessageGlobal = useMessageStore((state) => state.setSelectedMessage);
  const queryClient = useQueryClient();


  const { 
    register, 
    handleSubmit, 
    reset, 
    setValue, 
    formState: { errors, isSubmitting } 
  } = useForm<MessageFormData>();


  const { data: templates = [], isLoading } = useQuery({
    queryKey: ['templates'],
    queryFn: async () => await db.templates.toArray(),
  });

 
  const handleClear = () => {
    setSelectedTemplateId(null);
    reset({ title: '', text: '' });
    setSelectedMessageGlobal('');
  };

 
  const handleSelectTemplate = (template: MessageTemplate) => {
    if (template.id) {
      setSelectedTemplateId(template.id);
      setValue('title', template.title);
      setValue('text', template.text);
      setSelectedMessageGlobal(template.text);
    }
  };

  const saveMutation = useMutation({
    mutationFn: async (data: MessageFormData) => {
      if (selectedTemplateId) {
        await db.templates.update(selectedTemplateId, data);
      } else {
        await db.templates.add(data);
      }
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
      toast.success('Template guardado com sucesso!');
      setSelectedMessageGlobal(data.text);
      handleClear();
    },
    onError: (err) => toast.error(`Erro ao guardar: ${err}`),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => await db.templates.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
      toast.success('Template excluído com sucesso!');
      handleClear();
    },
    onError: (err) => toast.error(`Erro ao excluir: ${err}`),
  });

  const handleDelete = (id: number) => {
    toast((t) => (
      <div className="flex flex-col gap-3  bg-card p-3 rounded-md">
        <span className="text-sm text-text-primary">
          Tem certeza que deseja excluir este template?
        </span>
        <div className="flex gap-2 justify-end">
          <button
            onClick={() => {
              deleteMutation.mutate(id);
              toast.dismiss(t.id);
            }}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-md text-sm transition-all flex items-center gap-1"
          >
            <Trash size={14} weight="bold" /> Sim
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="border border-border-color px-3 py-1.5 rounded-md text-sm hover:bg-input-bg transition-all"
          >
            Cancelar
          </button>
        </div>
      </div>
    ), {
      duration: 5000,
      style: {
        background: 'var(--color-card)',
        color: 'var(--color-text-primary)',
        borderRadius: '0.5rem',
        boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
      },
    });
  };

  const onSubmit = (data: MessageFormData) => {
    saveMutation.mutate(data);
  };

  return (
    <div className="w-full max-w-6xl mx-auto flex gap-6 h-[calc(100vh-8rem)]">
      <div className="flex-1 flex flex-col">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-text-primary flex items-center gap-2">
            <ChatCircle className="text-action-primary" weight="fill" />
            Editor de Mensagem
          </h1>
          <p className="text-text-secondary">
            Crie e guarde templates para usar nos seus disparos.
          </p>
        </div>

        <form 
          onSubmit={handleSubmit(onSubmit)} 
          className="bg-card rounded-lg p-6 flex-1 flex flex-col shadow-sm border border-border-color/10"
        >
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-text-secondary mb-2">
              Título do Template
            </label>
            <input
              id="title"
              {...register('title', { required: 'O título é obrigatório' })}
              className="w-full bg-input-bg border border-border-color text-text-primary rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-action-primary transition-all"
              placeholder="Ex: Cobrança Padrão"
              autoComplete="off"
            />
            {errors.title && <span className="text-red-500 text-xs mt-1">{errors.title.message}</span>}
          </div>
          <div className="flex-1 flex flex-col mb-4">
            <label htmlFor="text" className="block text-sm font-medium text-text-secondary mb-2">
              Conteúdo da Mensagem
            </label>
            <textarea
              id="text"
              {...register('text', { required: 'O conteúdo da mensagem é obrigatório' })}
              className="flex-1 w-full bg-input-bg border border-border-color text-text-primary rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-action-primary resize-none transition-all font-sans leading-relaxed"
              placeholder="Digite a sua mensagem... Use {{nome}} e {{cpf}} como variáveis."
              autoComplete="off"
            />
            {errors.text && <span className="text-red-500 text-xs mt-1">{errors.text.message}</span>}
          </div>
          <div className="mb-6 p-3 bg-input-bg/50 rounded-md border border-border-color/30 text-sm text-text-secondary flex gap-4">
            <span>
              <code className="bg-card px-1.5 py-0.5 rounded text-action-primary border border-action-primary/20">{'{{nome}}'}</code> = Nome do Contato
            </span>
            <span>
              <code className="bg-card px-1.5 py-0.5 rounded text-action-primary border border-action-primary/20">{'{{cpf}}'}</code> = CPF
            </span>
          </div>
          <div className="flex justify-between">
            <button
              type="button"
              onClick={handleClear}
              className="flex items-center gap-2 px-4 py-2 rounded-md text-text-secondary hover:bg-input-bg hover:text-text-primary transition-colors active:scale-95"
            >
              <PlusCircle size={20} />
              Novo / Limpar
            </button>

            <button
              type="submit"
              disabled={isSubmitting || saveMutation.isPending}
              className="flex items-center gap-2 bg-action-primary hover:bg-action-primary-hover text-white px-6 py-2.5 rounded-md font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
            >
              <FloppyDisk size={20} weight="bold" />
              {saveMutation.isPending ? 'A guardar...' : (selectedTemplateId ? 'Atualizar Template' : 'Guardar Novo Template')}
            </button>
          </div>
        </form>
      </div>
      <div className="w-80 bg-card rounded-lg p-6 flex flex-col overflow-hidden shadow-sm border border-border-color/10">
        <h2 className="text-xl font-semibold text-text-primary mb-4 flex items-center justify-between">
          Templates
          <span className="text-xs font-normal text-text-secondary bg-input-bg px-2 py-1 rounded-full">
            {templates.length} guardados
          </span>
        </h2>

        <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-border-color scrollbar-track-transparent">
          {isLoading ? (
            <p className="text-text-secondary text-center py-4">A carregar...</p>
          ) : templates.length === 0 ? (
            <div className="text-center py-8 text-text-secondary flex flex-col items-center opacity-60">
              <ChatCircle size={32} className="mb-2" weight="thin" />
              <p className="text-sm italic">Nenhum template guardado.</p>
            </div>
          ) : (
            templates.map((template) => (
              <div 
                key={template.id}
                className={`p-3.5 rounded-lg border transition-all cursor-pointer group relative ${
                  selectedTemplateId === template.id 
                    ? 'bg-input-bg border-action-primary shadow-sm' 
                    : 'bg-app-bg/50 border-transparent hover:border-border-color hover:bg-input-bg'
                }`}
                onClick={() => handleSelectTemplate(template)}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`font-medium truncate pr-6 ${selectedTemplateId === template.id ? 'text-action-primary' : 'text-text-primary'}`}>
                    {template.title}
                  </span>
                  {selectedTemplateId === template.id && (
                    <CheckCircle size={18} className="text-action-primary absolute top-3.5 right-3.5" weight="fill" />
                  )}
                </div>
                <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed">
                  {template.text}
                </p>
                
                <div className={`mt-2 flex justify-end ${(selectedTemplateId === template.id) ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity`}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (template.id) handleDelete(template.id);
                    }}
                    className="text-text-secondary hover:text-red-400 p-1.5 rounded-md hover:bg-red-400/10 transition-colors"
                    title="Eliminar template"
                  >
                    <Trash size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
