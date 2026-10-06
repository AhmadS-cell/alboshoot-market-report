(() => {
  const form = document.getElementById('cost-form');
  if (!form) return;
  const ids = ['cost-price', 'cost-vat', 'cost-other', 'cost-target'];
  const fields = ids.map(id => document.getElementById(id));
  const result = document.getElementById('cost-result');
  const chart = document.getElementById('cost-chart');
  const exampleNote = document.getElementById('cost-example-note');
  const money = n => n.toFixed(2) + ' ريال';
  function update() {
    chart.hidden = true;
    if (fields.some(e => e.value.trim() === '')) {
      result.textContent = 'أكمل وضع الضريبة والمصاريف والهدف حتى نحسب سقف تكلفة الوصول.';
      return;
    }
    const [price, vat, other, target] = fields.map(e => Number(e.value));
    if (![price, vat, other, target].every(Number.isFinite) || price <= 0 || ![0,15].includes(vat) || other < 0 || target < 0 || target >= 100) {
      result.textContent = 'أدخل سعرًا موجبًا ومصاريف غير سالبة وهدفًا من 0 إلى أقل من 100%.';
      return;
    }
    const net = price / (1 + vat / 100), contribution = net * target / 100;
    const landed = net - contribution - other;
    if (landed < 0) {
      result.textContent = 'المصاريف والهدف تتجاوز صافي الإيراد بفارق ' + money(-landed) + '. هذا السيناريو لا يترك تكلفة موجبة للقطعة؛ راجع افتراضاته.';
      return;
    }
    result.textContent = 'سقف تكلفة الوصول: ' + money(landed) + ' | صافي الإيراد: ' + money(net) + ' | المصاريف الأخرى: ' + money(other) + ' | المساهمة المستهدفة: ' + money(contribution) + '. هذا سقف تخطيطي وليس عرض مورد أو ربحًا صافيًا.';
    ['bar-landed','bar-other','bar-target'].forEach((id,i) => {
      document.getElementById(id).style.width = ([landed,other,contribution][i] / net * 100) + '%';
    });
    chart.hidden = false;
  }
  form.addEventListener('submit', e => e.preventDefault());
  fields.forEach(e => e.addEventListener('input', () => { exampleNote.hidden = true; update(); }));
  document.getElementById('cost-example').addEventListener('click', () => {
    [450,15,100,25].forEach((v,i) => fields[i].value = v);
    exampleNote.hidden = false;
    update();
  });
  document.getElementById('cost-reset').addEventListener('click', () => {
    [450,'','',''].forEach((v,i) => fields[i].value = v);
    exampleNote.hidden = true;
    update();
  });
  update();
})();
