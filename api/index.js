// index.js
import express from "express";
import cors from "cors";
import pkg from "whatsapp-web.js";
import qrcode from "qrcode-terminal";

const { Client, LocalAuth } = pkg;
const app = express();
const port = 3333;

app.use(express.json());
app.use(cors());

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function mascararCPF(cpf) {
  if (!cpf) return "";

  const somenteNumeros = cpf.replace(/\D/g, "");

  if (somenteNumeros.length !== 11) {
    
    return cpf;
  }

  return `***.***.${somenteNumeros.slice(6, 9)}-${somenteNumeros.slice(9)}`;
}


function substituirVariaveis(texto, dados) {
  if (!texto) return "";

  const cpfMascarado = mascararCPF(dados.cpf);

  return texto
    .replace(/{{\s*nome\s*}}/gi, dados.nome || "")
    .replace(/{{\s*cpf\s*}}/gi, cpfMascarado);
}

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  },
});

client.on("qr", (qr) => {
  console.log("📲 Escaneie o QR Code abaixo para conectar:");
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("✅ WhatsApp conectado e pronto!");
});

client.initialize();

app.post("/send-message", async (req, res) => {
  try {
    const mensagem = req.body.mensagem || req.body.message;
    const contatos = req.body.contatos || req.body.contacts;

    if (!mensagem || !Array.isArray(contatos)) {
      return res
        .status(400)
        .json({
          message:
            "Envie os dados no formato correto: { mensagem, contatos[] }",
        });
    }

    const sucesso = [];
    const falhas = [];

    for (const contato of contatos) {
      const numero = contato.numero || contato.phone || contato.telefone;
      const nome = contato.nome || "";
      const cpf = contato.cpf || "";

      if (!numero) {
        console.warn("⚠ Contato sem número ignorado:", contato);
        falhas.push({ contato, erro: "Número ausente" });
        continue;
      }

      const numeroFormatado = numero.replace(/\D/g, "");
      const jid = numeroFormatado.endsWith("@c.us")
        ? numeroFormatado
        : `${numeroFormatado}@c.us`;

      const mensagemFinal = substituirVariaveis(mensagem, { nome, cpf });

      try {
        await client.sendMessage(jid, mensagemFinal);
        console.log(`✅ Mensagem enviada para ${jid}: "${mensagemFinal}"`);
        sucesso.push(jid);
      } catch (erro) {
        console.error(`❌ Falha ao enviar para ${jid}:`, erro.message);
        falhas.push({ contato: jid, erro: erro.message });
      }

      const pausa = Math.floor(Math.random() * (25000 - 20000 + 1)) + 20000;
      await delay(pausa);
    }

    console.log(
      `📊 Envio finalizado. Sucesso: ${sucesso.length}, Falhas: ${falhas.length}`
    );

    return res.status(200).json({
      success: sucesso,
      failed: falhas,
      total: contatos.length,
      message: "Envio concluído",
    });
  } catch (erro) {
    console.error("❌ Erro geral na API:", erro.message);
    return res.status(500).json({
      message: "Erro interno no servidor.",
      error: erro.message,
    });
  }
});

app.listen(port, () =>
  console.log(`🚀 Servidor rodando em http://localhost:${port}`)
);
