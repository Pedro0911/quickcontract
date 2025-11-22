// app.js — versão reescrita (cole inteira no seu app.js)
// Requisitos implementados:
// - CPF: aceita exatamente 11 dígitos (armazenado raw em dataset.raw e validado)
// - Datas: usa <input type="date"> e converte para DD/MM/AAAA ao gerar
// - Valores (currency): aceita diversos formatos (1.234,56 ou 1234.56), converte para Number e formata visualmente
// - Números inteiros (prazos/aviso): input type=number
// - Validações: mostra alert com todos os erros antes de gerar
// - Render: substitui placeholders por valores formatados no preview
// - Download PDF: usa html2pdf (verifique CDN carregado antes deste script)
// - NOVO: NOMES AUTOMATICAMENTE EM MAIÚSCULO

const TEMPLATES = {
  prestacao: {
    title: 'QuickContract — geração automática de contratos.',
    body: `
      <h2 style="text-align:center;">CONTRATO DE PRESTAÇÃO DE SERVIÇOS</h2>
      <p>IDENTIFICAÇÃO DAS PARTES:</p>
      <p><strong>CONTRATANTE:</strong> {{CONTRATANTE_NOME}}, CPF/CNPJ: {{CONTRATANTE_CPF}}, com endereço em {{CONTRATANTE_ENDERECO}}.</p>
      <p><strong>CONTRATADO:</strong> {{CONTRATADO_NOME}}, CPF: {{CONTRATADO_CPF}}, com endereço em {{CONTRATADO_ENDERECO}}.</p>
      <p>CLÁUSULA 1 — DO OBJETO: O presente contrato tem por objeto a prestação dos serviços de {{OBJETO_SERVICOS}} descritos neste instrumento.</p>
      <p>CLÁUSULA 2 — DO PRAZO: O prazo para execução dos serviços será de {{PRAZO}} meses, com início em {{DATA_INICIO}} e término em {{DATA_TERMINO}}.</p>
      <p>CLÁUSULA 3 — DO PREÇO: Pela prestação dos serviços, a CONTRATANTE pagará ao CONTRATADO o valor de R$ {{VALOR}}, nas condições: {{CONDICOES_PAGAMENTO}}.</p>
      <p>CLÁUSULA 4 — DAS OBRIGAÇÕES: As partes obrigam-se a cumprir o presente contrato conforme as cláusulas e condições aqui estabelecidas.</p>
      <p>CLÁUSULA 5 — DA RESCISÃO: O contrato poderá ser rescindido por qualquer das partes, mediante aviso prévio de {{AVISO_PREVIO}} dias.</p>
      <p>CLÁUSULA 6 — DO FORO: Para dirimir dúvidas ou litígios, fica eleito o foro da comarca de {{FORO}}.</p>
      <br>
      <p>Assinaturas:</p>
      <p>______________________________</p>
      <p>{{CONTRATANTE_NOME}}</p>
      <br>
      <p>______________________________</p>
      <p>{{CONTRATADO_NOME}}</p>
    `
  },
  compra: {
    title: 'QuickContract — geração automática de contratos.',
    body: `
      <h2 style="text-align:center;">CONTRATO DE COMPRA E VENDA</h2>
      <p><strong>VENDEDOR:</strong> {{VENDEDOR_NOME}}, CPF/CNPJ: {{VENDEDOR_CPF}}, endereço: {{VENDEDOR_ENDERECO}}.</p>
      <p><strong>COMPRADOR:</strong> {{COMPRADOR_NOME}}, CPF: {{COMPRADOR_CPF}}, endereço: {{COMPRADOR_ENDERECO}}.</p>
      <p>CLÁUSULA 1 — DO OBJETO: O VENDEDOR vende ao COMPRADOR o bem descrito como {{DESCRICAO_BEM}}.</p>
      <p>CLÁUSULA 2 — DO PREÇO: O preço ajustado é de R$ {{VALOR}} que será pago {{CONDICOES_PAGAMENTO}}.</p>
      <p>CLÁUSULA 3 — DA ENTREGA: A entrega do bem ocorrerá em {{LOCAL_ENTREGA}} na data {{DATA_ENTREGA}}.</p>
      <p>CLÁUSULA 4 — DA GARANTIA: {{GARANTIA}}</p>
      <p>CLÁUSULA 5 — DO FORO: O foro eleito para litígios é o da comarca de {{FORO}}.</p>
      <br>
      <p>Assinaturas:</p>
      <p>______________________________</p>
      <p>{{VENDEDOR_NOME}}</p>
      <br>
      <p>______________________________</p>
      <p>{{COMPRADOR_NOME}}</p>
    `
  },
  nda: {
    title: 'QuickContract — geração automática de contratos.',
    body: `
      <h2 style="text-align:center;">ACORDO DE CONFIDENCIALIDADE</h2>
      <p>Este Acordo de Confidencialidade é celebrado entre {{PARTY_A}} e {{PARTY_B}}.</p>
      <p>1. Definições: "Informações Confidenciais" incluem todas as informações técnicas, comerciais e estratégicas relativas a {{ASSUNTO_CONFIDENCIAL}}.</p>
      <p>2. Obrigações: As partes concordam em não divulgar as Informações Confidenciais a terceiros e a usar tais informações apenas para {{FINALIDADE}}.</p>
      <p>3. Prazo: O presente acordo terá validade por {{PRAZO_MES}} meses a partir da assinatura.</p>
      <p>4. Penalidades: Em caso de violação, a parte infratora será responsável por indenizar os danos comprovados.</p>
      <br>
      <p>Assinaturas:</p>
      <p>______________________________</p>
      <p>{{PARTY_A}}</p>
      <br>
      <p>______________________________</p>
      <p>{{PARTY_B}}</p>
    `
  },
  aluguel: {
    title: 'QuickContract — geração automática de contratos.',
    body: `
      <h2 style="text-align:center;">CONTRATO DE LOCAÇÃO DE CURTO PRAZO</h2>
      <p><strong>LOCADOR:</strong> {{LOCADOR_NOME}}, CPF/CNPJ: {{LOCADOR_CPF}}, endereço: {{LOCADOR_ENDERECO}}.</p>
      <p><strong>LOCATÁRIO:</strong> {{LOCATARIO_NOME}}, CPF: {{LOCATARIO_CPF}}, endereço: {{LOCATARIO_ENDERECO}}.</p>
      <p>CLÁUSULA 1 — DO IMÓVEL: O LOCADOR aluga ao LOCATÁRIO o imóvel localizado em {{ENDERECO_IMOVEL}}.</p>
      <p>CLÁUSULA 2 — DO PRAZO: A locação terá início em {{DATA_INICIO}} e término em {{DATA_TERMINO}}.</p>
      <p>CLÁUSULA 3 — DO VALOR: O valor total é de R$ {{VALOR}}, pagos {{CONDICOES_PAGAMENTO}}.</p>
      <p>CLÁUSULA 4 — DAS RESPONSABILIDADES: O LOCATÁRIO se responsabiliza por danos causados ao imóvel durante o período da locação.</p>
      <p>CLÁUSULA 5 — DO FORO: Fica eleito o foro da comarca de {{FORO}}.</p>
      <br>
      <p>Assinaturas:</p>
      <p>______________________________</p>
      <p>{{LOCADOR_NOME}}</p>
      <br>
      <p>______________________________</p>
      <p>{{LOCATARIO_NOME}}</p>
    `
  }
};

// ---------- Helpers ----------
function extractPlaceholders(html){
  const re = /{{(.*?)}}/g;
  const set = new Set();
  let m;
  while((m = re.exec(html)) !== null) set.add(m[1].trim());
  return Array.from(set);
}
function escapeRegExp(s){ return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
function sanitize(s){ return String(s).replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\n/g,'<br>'); }

function parseCurrency(input){
  if(input === undefined || input === null) return NaN;
  const cleaned = String(input).replace(/\s/g,'').replace(/\./g,'').replace(/,/g,'.');
  return Number(cleaned);
}
function formatDateToDDMMYYYY(iso){
  if(!iso) return '';
  if(/^\d{4}-\d{2}-\d{2}$/.test(iso)){
    const [y,m,d] = iso.split('-'); return `${d}/${m}/${y}`;
  }
  if(/^\d{2}\/\d{2}\/\d{4}$/.test(iso)) return iso;
  return iso;
}

// ---------- DOM refs ----------
const formFields = document.getElementById('formFields');
const templateSel = document.getElementById('templateSel');
const contractArea = document.getElementById('contractArea');
const preview = document.getElementById('preview');

// Detect input type
function detectTypeFromPlaceholder(name){
  const key = name.toUpperCase();
  if(/CPF$/.test(key) || key.includes('CPF')) return 'cpf';
  if(key.includes('DATA') || key.includes('DATE')) return 'date';
  if(key.includes('VALOR') || key.includes('PRECO') || key.includes('PREÇO')) return 'currency';
  if(key.includes('PRAZO') || key.includes('AVISO') || key.includes('QTDE') || key.includes('NUM') || key.includes('QUANT')) return 'number';
  return 'text';
}

// Detect if placeholder is a name (to uppercase)
function isNameField(p){
  return (
    p.toUpperCase().endsWith('_NOME') ||
    p.toUpperCase().startsWith('PARTY_') ||
    ['VENDEDOR_NOME','COMPRADOR_NOME','LOCADOR_NOME','LOCATARIO_NOME'].includes(p.toUpperCase())
  );
}

// Build dynamic form
function buildFormFor(templateKey){
  formFields.innerHTML = '';
  const tpl = TEMPLATES[templateKey];
  const placeholders = extractPlaceholders(tpl.body);

  placeholders.forEach(p => {
    const id = 'field_' + p;
    const type = detectTypeFromPlaceholder(p);
    const div = document.createElement('div'); div.className = 'field';
    const label = document.createElement('label'); label.innerText = p.replace(/_/g,' ').toUpperCase();

    let input;
    if(type === 'date'){
      input = document.createElement('input'); input.type = 'date';
    } else if(type === 'currency'){
      input = document.createElement('input'); input.type = 'text'; input.inputMode = 'decimal'; input.placeholder = '0,00';
      input.addEventListener('blur', e => {
        const n = parseCurrency(e.target.value);
        if(!isNaN(n)) e.target.value = n.toLocaleString('pt-BR', {minimumFractionDigits:2, maximumFractionDigits:2});
      });
    } else if(type === 'cpf'){
      input = document.createElement('input'); input.type = 'text'; input.inputMode = 'numeric'; input.maxLength = 14; input.placeholder = '000.000.000-00';
      input.addEventListener('input', e => {
        const digits = e.target.value.replace(/\D/g,'').slice(0,11);
        e.target.dataset.raw = digits;
        let v = digits;
        if(v.length > 9) v = v.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
        else if(v.length > 6) v = v.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
        else if(v.length > 3) v = v.replace(/(\d{3})(\d{1,3})/, '$1.$2');
        e.target.value = v;
      });
    } else if(type === 'number'){
      input = document.createElement('input'); input.type = 'number'; input.step = '1'; input.min = '0';
    } else {
      input = document.createElement('input'); input.type = 'text';
    }

    input.id = id;
    div.appendChild(label); div.appendChild(input); formFields.appendChild(div);
  });
}

// initial setup
buildFormFor(templateSel.value);
templateSel.addEventListener('change', () => buildFormFor(templateSel.value));

// Validate and collect
function validateAndCollect(templateKey){
  const tpl = TEMPLATES[templateKey];
  const placeholders = extractPlaceholders(tpl.body);
  const errors = [];
  const values = {};

  placeholders.forEach(p => {
    const el = document.getElementById('field_' + p);
    const type = detectTypeFromPlaceholder(p);
    const raw = el ? el.value : '';

    if(type === 'cpf'){
      const digits = (el && el.dataset && el.dataset.raw) ? el.dataset.raw : String(raw).replace(/\D/g,'');
      if(digits.length !== 11) errors.push(`${p}: CPF deve conter 11 dígitos`);
      values[p] = digits;
    } else if(type === 'currency'){
      const n = parseCurrency(raw);
      if(isNaN(n)) errors.push(`${p}: Valor inválido`);
      values[p] = Number(isNaN(n) ? 0 : Number(n.toFixed(2)));
    } else if(type === 'date'){
      if(!raw){ errors.push(`${p}: Data não informada`); values[p] = ''; }
      else {
        if(/^\d{4}-\d{2}-\d{2}$/.test(raw)) values[p] = formatDateToDDMMYYYY(raw);
        else if(/^\d{2}\/\d{2}\/\d{4}$/.test(raw)) values[p] = raw;
        else { errors.push(`${p}: Formato de data inválido`); values[p] = raw; }
      }
    } else if(type === 'number'){
      const n = Number(raw);
      if(raw === '' || isNaN(n)) errors.push(`${p}: Número inválido ou não informado`);
      values[p] = Number(isNaN(n) ? 0 : n);
    } else {
      let sanitized = sanitize(raw || '__________________');
      if(isNameField(p)) sanitized = sanitized.toUpperCase(); // <<<<<< AQUI: NOMES EM MAIÚSCULO
      values[p] = sanitized;
    }
  });

  return { values, errors };
}

// Render contract
function renderContract(templateKey, collected){
  const tpl = TEMPLATES[templateKey];
  let html = tpl.body;
  const placeholders = extractPlaceholders(tpl.body);

  placeholders.forEach(p => {
    let val = collected[p];
    const type = detectTypeFromPlaceholder(p);

    if(type === 'cpf'){
      if(typeof val === 'string' && /^\d{11}$/.test(val)){
        val = val.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
      }
    } else if(type === 'currency'){
      if(typeof val === 'number' && !isNaN(val)) val = val.toLocaleString('pt-BR', {minimumFractionDigits:2, maximumFractionDigits:2});
    }

    html = html.replace(new RegExp('{{\\s*' + escapeRegExp(p) + '\\s*}}', 'g'), val);
  });

  contractArea.innerHTML = `<h2 style="text-align:center;color:#0b1220">${TEMPLATES[templateKey].title}</h2>` + html;
  preview.scrollTop = 0;
}

// Events
document.getElementById('fillBtn').addEventListener('click', () => {
  const { values, errors } = validateAndCollect(templateSel.value);
  if(errors.length){
    alert('Erros detectados:\n' + errors.join('\n'));
    return;
  }
  renderContract(templateSel.value, values);
});

document.getElementById('resetBtn').addEventListener('click', () => {
  const inputs = formFields.querySelectorAll('input');
  inputs.forEach(i => { i.value = ''; delete i.dataset.raw; });
  contractArea.innerHTML = `<h2 style="text-align:center;color:#0b1220">${TEMPLATES[templateSel.value].title}</h2><p style="text-align:center;color:#666;font-size:14px">Preencha os campos e clique em <strong>Preencher e Visualizar</strong></p>`;
});

document.getElementById('downloadPdf').addEventListener('click', () => {
  if(!contractArea.innerHTML || contractArea.innerHTML.trim() === '') { alert('Gere o contrato antes de baixar.'); return; }
  const opt = { margin:0.4, filename: (TEMPLATES[templateSel.value].title.replace(/[^a-z0-9]/gi,'_')||'contrato') + '.pdf', html2canvas:{scale:2}, jsPDF:{unit:'in',format:'a4',orientation:'portrait'} };
  if(typeof html2pdf === 'undefined'){ alert('A biblioteca html2pdf não foi carregada. Verifique se o CDN está presente antes do seu app.js.'); return; }
  html2pdf().set(opt).from(contractArea).save();
});

// Auto fill sample
(function fillSample(){
  const sample = {
    CONTRATANTE_NOME: 'Empresa ABC Ltda', CONTRATANTE_CPF: '12345678901', CONTRATANTE_ENDERECO: 'Rua A, 123, Cidade - UF',
    CONTRATADO_NOME: 'Fulano de Tal', CONTRATADO_CPF: '98765432100', CONTRATADO_ENDERECO: 'Rua B, 45',
    OBJETO_SERVICOS: 'desenvolvimento de site e manutenção', PRAZO: '3', DATA_INICIO: '2026-01-01', DATA_TERMINO: '2026-03-31', VALOR: '3500.00', CONDICOES_PAGAMENTO: '50% na assinatura e 50% na entrega', AVISO_PREVIO: '30', FORO: 'São Miguel dos Campos'
  };
  const placeholders = extractPlaceholders(TEMPLATES[templateSel.value].body);
  placeholders.forEach(p => {
    const el = document.getElementById('field_'+p);
    if(el && sample[p] !== undefined){
      const type = detectTypeFromPlaceholder(p);
      if(type === 'cpf'){
        el.value = sample[p].replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
        el.dataset.raw = sample[p];
      } else if(type === 'date'){
        el.value = sample[p];
      } else if(type === 'currency'){
        el.value = Number(sample[p]).toLocaleString('pt-BR', {minimumFractionDigits:2, maximumFractionDigits:2});
      } else el.value = sample[p];
    }
  });
})();

