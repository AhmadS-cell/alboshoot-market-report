export const embroideryPhrases = [
 {value:'personal',label:'خاص بـ',hint:'قطعة تحمل اسمك'},
 {value:'wellness',label:'ملبوس العافية',hint:'دعوة جميلة لك أو لمن تهديها'}
];
export const embroideryLines = (name,phrase='personal') => phrase==='name'?[name]:[phrase==='wellness'?'ملبوس العافية':'خاص بـ',name];
export const embroideryText = (name,phrase='personal') => phrase==='name'?name:phrase==='wellness'?`ملبوس العافية · ${name}`:`خاص ب${name}`;
