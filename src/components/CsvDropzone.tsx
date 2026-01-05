import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadSimple, Warning, CheckCircle } from 'phosphor-react';
import Papa from 'papaparse';
import clsx from 'clsx';
import { useMessageStore } from '../store/messageStore';

export function CsvDropzone() {
  // Usa a action global para adicionar contatos
  const addContacts = useMessageStore((state) => state.addContacts);
  
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setStatus('idle');
    setMessage('');

    Papa.parse(file, {
      header: true, 
      skipEmptyLines: true,
      complete: (results) => {
        
        if (results.errors.length > 0) {
          setStatus('error');
          setMessage('Erro ao ler o ficheiro CSV. Verifique a formatação.');
          return;
        }

        
        const newContacts = results.data.map((row: any) => ({
          id: crypto.randomUUID(),
          nome: row.nome || row.Nome || '',
          cpf: row.cpf || row.CPF || '',
          numero: row.numero || row.Numero || row.celular || '',
        })).filter((c: any) => c.nome && c.numero); 

        if (newContacts.length === 0) {
          setStatus('error');
          setMessage('Nenhum contacto válido encontrado. Verifique as colunas (nome, numero).');
          return;
        }

        
        addContacts(newContacts);
        setStatus('success');
        setMessage(`${newContacts.length} contactos importados com sucesso!`);
        setTimeout(() => {
           setStatus('idle');
           setMessage('');
        }, 3000);
      },
      error: () => {
        setStatus('error');
        setMessage('Falha crítica ao ler o ficheiro.');
      }
    });
  }, [addContacts]);

  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.csv'], 
    },
    multiple: false, 
  });

  return (
    <div>
      <div
        {...getRootProps()}
        className={clsx(
          "w-full border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 ease-in-out",
          {
           
            'border-border-color bg-input-bg hover:border-action-primary hover:bg-card': status === 'idle' && !isDragActive,
            'border-action-primary bg-card scale-[1.02]': isDragActive,
            'border-action-primary bg-action-primary/10': status === 'success',
            'border-red-500 bg-red-500/10': status === 'error'
          }
        )}
      >
        <input {...getInputProps()} />
        {status === 'idle' && (
          <>
            <UploadSimple 
              size={40} 
              className={clsx(
                "transition-colors",
                isDragActive ? 'text-action-primary' : 'text-text-secondary'
              )} 
            />
            <p className="mt-4 text-lg font-medium text-text-primary">
              {isDragActive ? 'Solte o ficheiro aqui...' : 'Clique ou arraste um ficheiro CSV'}
            </p>
            <p className="mt-2 text-sm text-text-secondary">
              Colunas necessárias: <strong>nome</strong>, <strong>numero</strong> (opcional: cpf)
            </p>
          </>
        )}
        {status === 'success' && (
          <div className="flex flex-col items-center animate-fadeIn">
            <CheckCircle size={40} className="text-action-primary mb-3" weight="fill" />
            <p className="text-action-primary font-semibold text-lg">{message}</p>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center animate-fadeIn">
            <Warning size={40} className="text-red-500 mb-3" weight="fill" />
            <p className="text-red-400 font-semibold">{message}</p>
            <p className="text-text-secondary text-sm mt-2">Tente novamente com um ficheiro .csv válido.</p>
          </div>
        )}
      </div>
    </div>
  );
}