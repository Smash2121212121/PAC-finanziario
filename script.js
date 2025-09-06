const form = document.getElementById("Pac");
const results = document.getElementById("results");

form.addEventListener('submit', function(e) {
  e.preventDefault();

  const capIniziale = parseFloat(document.getElementById('capIniziale').value);
  const capMensile = parseFloat(document.getElementById('capMensile').value);
  const capAnno = parseFloat(document.getElementById('capAnno').value);
  const inputAnn = document.getElementById('Ann').value;
  const inputObb = document.getElementById('Obb').value;

  const anni = inputAnn ? parseInt(inputAnn, 10) : null;
  const obiettivo = inputObb ? parseFloat(inputObb) : null;

  let result = '';

  if (anni !== null) {
    const { totale, versamenti, interessi } = calcByAnn(capIniziale, capMensile, capAnno, anni);

    const totaleFormattato = totale.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const versamentiFormattati = versamenti.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const interessiFormattati = interessi.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    result = `In ${anni} anni avrai ${totaleFormattato}€ (di cui ${versamentiFormattati}€ versati e ${interessiFormattati}€ guadagnati dagli interessi)`;

  } else if (obiettivo !== null) {
    const { mesi, anni: anniCalcolati } = calcByObb(capIniziale, capMensile, capAnno, obiettivo);
    result = `Per raggiungere ${obiettivo}€ servono ${Math.ceil(mesi)} mesi (${anniCalcolati.toFixed(1)} anni)`;
  } else {
    result = 'Inserisci almeno un obiettivo o un orizzonte temporale';
  }

  results.textContent = result;
});
function calcByAnn(capIniziale, capMensile, capAnno, anni) {
  let totale = capIniziale;
  const RendMensile = capAnno / 100;
  const Taxanno = capMensile * 12;
  let versamenti = 0;
  for (let i = 0; i < anni; i++) {
    totale += Taxanno;
    totale *= (1 + RendMensile);
    versamenti += Taxanno;
  }
  const interessi = totale - (capIniziale + versamenti);
  return { totale, versamenti, interessi };
}

function calcByObb(capIniziale, capMensile, capAnno, obiettivo) {
  let totale = capIniziale;
  const RendMensile = capAnno / 100 / 12;
  let mesi = 0;
  while (totale < obiettivo && mesi < 1200) {
    totale += capMensile;
    totale *= (1 + RendMensile);
    mesi++;
  }
  return { mesi, anni: mesi / 12 };
}
