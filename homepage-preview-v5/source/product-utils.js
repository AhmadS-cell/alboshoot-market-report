export const priceNumber = value => Number(value.replace(/[٠-٩]/g,n=>'٠١٢٣٤٥٦٧٨٩'.indexOf(n)).replace(/[^\d.]/g,''));
export const formatPrice = value => new Intl.NumberFormat('ar-SA').format(value);
export const galleryFor = product => {
 const folder='photos/collection/';
 const photos=[{src:folder+product.imageStem+'-800.webp',label:'أمام',alt:product.alt}];
 photos.push({src:folder+product.id+(['bisht','abaya'].includes(product.id)?'-angle.webp':'-side-800.webp'),label:'جانب',alt:product.name+' من الجانب'});
 photos.push({src:folder+product.id+'-detail-800.webp',label:'التفاصيل',alt:'تفاصيل '+product.name});
 photos.push({src:folder+product.id+'-fabric-800.webp',zoom:folder+product.id+'-fabric-full.webp',label:'القماش',alt:'لقطة قريبة لنسيج قماش '+product.name,caption:'لقطة أقرب للنسيج والملمس في تصميم القطعة.'});
 photos.push({src:folder+product.id+'-inside-800.webp',zoom:folder+product.id+'-inside-full.webp',label:'الداخل',alt:'صورة توضيحية لخياطة وداخل '+product.name,caption:'الوجه الداخلي وتشطيب الدرزة في التصميم؛ تفاصيل البطانة تُعتمد مع عينة كل نسخة.'});
 if(['thobe','abaya'].includes(product.id))photos.push({src:folder+product.id+'-light-800.webp',zoom:folder+product.id+'-light-full.webp',label:'فحص الضوء',alt:'تصور طريقة فحص قماش '+product.name+' أمام الضوء، وليس نتيجة اختبار فعلية',caption:'تصور لطريقة فحص الضوء؛ الصور المولّدة لا تثبت الشفافية. نتيجة الستر تحتاج تصوير عينة كل لون في الضوء والحركة.'});
 return photos;
};
export const cartKey = item => JSON.stringify([item.id,item.size,item.purpose,item.message||'',!!item.wrapping,item.nameEnabled?item.embroideredName:'',item.nameEnabled?item.thread:'',item.lengthEnabled?item.length:'']);
