export const priceNumber = value => Number(value.replace(/[٠-٩]/g,n=>'٠١٢٣٤٥٦٧٨٩'.indexOf(n)).replace(/[^\d.]/g,''));
export const formatPrice = value => new Intl.NumberFormat('ar-SA').format(value);
export const galleryFor = product => {
 const folder='photos/collection/';
 const photos=[{src:folder+product.imageStem+'-800.webp',label:'أمام',alt:product.alt}];
 photos.push({src:folder+product.id+(['bisht','abaya'].includes(product.id)?'-angle.webp':'-side-800.webp'),label:'جانب',alt:product.name+' من الجانب'});
 photos.push({src:folder+product.id+'-detail-800.webp',label:'التفاصيل',alt:'تفاصيل '+product.name});
 return photos;
};
export const cartKey = item => JSON.stringify([item.id,item.size,item.purpose,item.message||'',!!item.wrapping,item.nameEnabled?item.embroideredName:'',item.nameEnabled?item.thread:'',item.lengthEnabled?item.length:'']);
