
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: 'https://Micau183.github.io/brulez_vos_voiture/',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "route": "/brulez_vos_voiture"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 694, hash: 'a904b890068bd506438e89668d34d84af2131ee6bf26841a2820b04418121ed6', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1096, hash: 'e18310f2cd61adc9466244c121f222d6cd7fdce5f1d8aec8106cde0740cb18c2', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'index.html': {size: 4751, hash: '907a5485555533fdd98e1a1668c572e93d45e2f03583c875960ef6a1c7bcb132', text: () => import('./assets-chunks/index_html.mjs').then(m => m.default)},
    'styles-SB4KVC7H.css': {size: 11115, hash: 'KllfHcYBMHs', text: () => import('./assets-chunks/styles-SB4KVC7H_css.mjs').then(m => m.default)}
  },
};
