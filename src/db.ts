import Dexie, { type Table } from 'dexie';
import type { Contact } from './types/contact';
export interface MessageTemplate {
  id?: number;
  title: string;
  text: string;
}


export interface DispatchLogEntry {
  id?: number;
  contact: Contact; 
  timestamp: Date; 
}

export class ChatPulseDB extends Dexie {
  templates!: Table<MessageTemplate>;
  dispatchLog!: Table<DispatchLogEntry>; 

  constructor() {
    super('ChatPulseDB');
    
    
    this.version(5).stores({
      templates: '++id, title',
      dispatchLog: '++id, timestamp, contact.nome, contact.cpf' 
    });
  }
}

export const db = new ChatPulseDB();