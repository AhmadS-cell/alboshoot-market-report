import React from 'react';
import { renderToString } from 'react-dom/server';
import { App } from './App.jsx';
export { products, collections, collectionUrl, productUrl, asset, homeUrl } from './catalog.js';
export { PAGE_SIZE } from './pagination.js';
export const render = (pageKey, pageNumber = 1) => renderToString(<App pageKey={pageKey} pageNumber={pageNumber}/>);
