/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Paleta de cores baseada na sua imagem
      colors: {
        'app-bg': '#11141B',        // Fundo principal escuro
        'sidebar': '#0F172A',        // Fundo da Sidebar (um pouco diferente)
        'card': '#1E293B',          // Fundo dos formulários e listas
        'card-header': '#1E293B',   // Fundo do cabeçalho do card
        'input-bg': '#0F172A',      // Fundo dos inputs
        'border-color': '#334155',  // Cor da borda
        'text-primary': '#F1F5F9',  // Texto principal (claro)
        'text-secondary': '#94A3B8',// Texto (placeholders, descrições)
        'action-primary': '#10B981',// Verde (Botão ativo, badge)
        'action-primary-hover': '#059669',
        'action-secondary': '#3B82F6', // Azul (ex: botão "Adicionar")
        'action-secondary-hover': '#2563EB',
      },
    },
  },
  plugins: [],
}