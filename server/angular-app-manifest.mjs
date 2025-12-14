
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
    'index.csr.html': {size: 694, hash: '90178420dd6c6fdff3dc9764731e457a94a4df01c5a1cd8449d3d9e4c52badfd', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1096, hash: '25523c128d61433660a1274d19902abadd490f544e8cc43fb4c971826795d50e', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'index.html': {size: 4751, hash: '17d9b38f263bc00c82ef28a60934022b46ae075a2031666407adf57a1ee35971', text: () => import('./assets-chunks/index_html.mjs').then(m => m.default)},
    'styles-SB4KVC7H.css': {size: 11115, hash: 'KllfHcYBMHs', text: () => import('./assets-chunks/styles-SB4KVC7H_css.mjs').then(m => m.default)}
  },
};
