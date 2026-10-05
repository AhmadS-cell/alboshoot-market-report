export const priceNumber = value => Number(value.replace(/[٠-٩]/g,n=>'٠١٢٣٤٥٦٧٨٩'.indexOf(n)).replace(/[^\d.]/g,''));
export const formatPrice = value => new Intl.NumberFormat('ar-SA').format(value);
export const galleryFor = product => {
 const folder='photos/collection/';
 const photos=[{src:folder+product.imageStem+'-800.webp',label:'أمام',alt:product.alt}];
 if(['bisht','abaya'].includes(product.id))photos.push({src:folder+product.id+'-angle.webp',label:'جانب',alt:product.name+' من الجانب'});
 if(['bisht','thobe','abaya','farwa'].includes(product.id))photos.push({src:folder+product.id+'-detail-800.webp',label:'التفاصيل',alt:'تفاصيل '+product.name});
 return photos;
};
export const cartKey = item => [item.id,item.size,item.purpose,item.message||''].join('|');
