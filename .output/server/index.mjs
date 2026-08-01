globalThis.__nitro_main__ = import.meta.url;
import { a as FastResponse, n as HTTPError, r as defineLazyEventHandler, t as H3Core } from "./_libs/h3+rou3+srvx.mjs";
import { t as HookableCore } from "./_libs/hookable.mjs";
//#region #nitro-vite-setup
function lazyService(loader) {
	let promise, mod;
	return { fetch(req) {
		if (mod) return mod.fetch(req);
		if (!promise) promise = loader().then((_mod) => mod = _mod.default || _mod);
		return promise.then((mod) => mod.fetch(req));
	} };
}
var services = { ["ssr"]: lazyService(() => import("./_ssr/ssr.mjs")) };
globalThis.__nitro_vite_envs__ = services;
//#endregion
//#region #nitro/virtual/public-assets-data
var public_assets_data_default = {
	"/favicon.ico": {
		"type": "image/vnd.microsoft.icon",
		"etag": "\"4f95-3RXc3p2mhEAs1WBwaIvE0Y0uu0Y\"",
		"mtime": "2026-07-10T17:46:47.308Z",
		"size": 20373,
		"path": "../public/favicon.ico"
	},
	"/assets/app-BJ20QRNU.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6b7c-iL9/8azKy2ewISwXsvGMnXIMqAA\"",
		"mtime": "2026-07-23T05:49:08.388Z",
		"size": 27516,
		"path": "../public/assets/app-BJ20QRNU.js"
	},
	"/assets/api-Kju_d4QL.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"176b-wAEoCiioqjBKvCfXgmG53gozu9U\"",
		"mtime": "2026-07-23T05:49:08.387Z",
		"size": 5995,
		"path": "../public/assets/api-Kju_d4QL.js"
	},
	"/assets/api-hooks-C4TwWEcD.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"352f-Lzebq2rTIJ3XQz/ddOSeis4hJ5k\"",
		"mtime": "2026-07-23T05:49:08.388Z",
		"size": 13615,
		"path": "../public/assets/api-hooks-C4TwWEcD.js"
	},
	"/assets/app.customers-BkSaP-Ch.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"591b-8M7kBjXjAn4AZrRZx4HnH+i6e48\"",
		"mtime": "2026-07-23T05:49:08.389Z",
		"size": 22811,
		"path": "../public/assets/app.customers-BkSaP-Ch.js"
	},
	"/assets/app.audit-logs-lZM1qjkO.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5690-1kLWNZ4sB8ge1Klx6dMXbd4HZ30\"",
		"mtime": "2026-07-23T05:49:08.389Z",
		"size": 22160,
		"path": "../public/assets/app.audit-logs-lZM1qjkO.js"
	},
	"/assets/app.notifications-CnmSlNIQ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"d40-tpyJWmjrSxppZFhMRiNLUwHfij4\"",
		"mtime": "2026-07-23T05:49:08.389Z",
		"size": 3392,
		"path": "../public/assets/app.notifications-CnmSlNIQ.js"
	},
	"/assets/app.index-DuV3_C7E.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8ed4-dw/GFuNvK582iarqfZYwventsuc\"",
		"mtime": "2026-07-23T05:49:08.389Z",
		"size": 36564,
		"path": "../public/assets/app.index-DuV3_C7E.js"
	},
	"/assets/app.payments-Cekd0n3g.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2964-ymHa/rBp/b0vgjoM5aXC1mG9bWY\"",
		"mtime": "2026-07-23T05:49:08.391Z",
		"size": 10596,
		"path": "../public/assets/app.payments-Cekd0n3g.js"
	},
	"/assets/app.reports-CwJLsXfy.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"15f5-MGdxAimXJXTwjysSW/ACr+Mo2xw\"",
		"mtime": "2026-07-23T05:49:08.391Z",
		"size": 5621,
		"path": "../public/assets/app.reports-CwJLsXfy.js"
	},
	"/assets/app.advertisements-C74VEi4g.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3fe8-sq8Zc9pbNjGzrxn9YUjr83MGkCQ\"",
		"mtime": "2026-07-23T05:49:08.389Z",
		"size": 16360,
		"path": "../public/assets/app.advertisements-C74VEi4g.js"
	},
	"/assets/app.screen-builder-C-NAVXUP.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"d875-284EUBXXR5NapD4VAZp4Nk5BwD4\"",
		"mtime": "2026-07-23T05:49:08.391Z",
		"size": 55413,
		"path": "../public/assets/app.screen-builder-C-NAVXUP.js"
	},
	"/assets/app.subscriptions-C-hQV9kG.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"32c0-V5tKw6ewF4ukUjO/gPX5VkjCM8U\"",
		"mtime": "2026-07-23T05:49:08.392Z",
		"size": 12992,
		"path": "../public/assets/app.subscriptions-C-hQV9kG.js"
	},
	"/assets/app.theme-KLDEcsQG.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3ad8-kB9Pajg0FY2bWtCVQofTqRJvI4E\"",
		"mtime": "2026-07-23T05:49:08.393Z",
		"size": 15064,
		"path": "../public/assets/app.theme-KLDEcsQG.js"
	},
	"/assets/app.settings-D7PhMKrh.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1b2a-q2XVlcqhHP6JEmpRoyWnNhTYqMQ\"",
		"mtime": "2026-07-23T05:49:08.392Z",
		"size": 6954,
		"path": "../public/assets/app.settings-D7PhMKrh.js"
	},
	"/assets/badge-DhPwNmMz.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"303-npVJETG8wP8TUhMuC/jBSDTk0IM\"",
		"mtime": "2026-07-23T05:49:08.394Z",
		"size": 771,
		"path": "../public/assets/badge-DhPwNmMz.js"
	},
	"/assets/auth-CxIuQvMn.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"296-ZlQ6n3YMpDcqjWon/DYvKoHTD9w\"",
		"mtime": "2026-07-23T05:49:08.393Z",
		"size": 662,
		"path": "../public/assets/auth-CxIuQvMn.js"
	},
	"/assets/building-2-Bg7Fy2s8.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"260-xE87RftCUvi/w4X7Flhqin813/k\"",
		"mtime": "2026-07-23T05:49:08.395Z",
		"size": 608,
		"path": "../public/assets/building-2-Bg7Fy2s8.js"
	},
	"/assets/app.configuration-Dtc4QVxk.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8fd6-6DwSShW1RFMmKPS1yRJUlMpXB+I\"",
		"mtime": "2026-07-23T05:49:08.389Z",
		"size": 36822,
		"path": "../public/assets/app.configuration-Dtc4QVxk.js"
	},
	"/assets/bell-ring-BvkkmKQN.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"181-JWhBYeGLDPZTKNw3MucPYzprQMk\"",
		"mtime": "2026-07-23T05:49:08.394Z",
		"size": 385,
		"path": "../public/assets/bell-ring-BvkkmKQN.js"
	},
	"/assets/button-BnY2mVfF.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"516-b/dzZaXROlfyZBscmaRnOGurke8\"",
		"mtime": "2026-07-23T05:49:08.396Z",
		"size": 1302,
		"path": "../public/assets/button-BnY2mVfF.js"
	},
	"/assets/card-CZHw3pFe.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"422-FuaGA54k8UIbgWBnPyy3mP1dDmU\"",
		"mtime": "2026-07-23T05:49:08.396Z",
		"size": 1058,
		"path": "../public/assets/card-CZHw3pFe.js"
	},
	"/assets/chevron-left-CP2mo7JH.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"76-qgN8TwbQy8aTn7raDSgt/I7O5bI\"",
		"mtime": "2026-07-23T05:49:08.396Z",
		"size": 118,
		"path": "../public/assets/chevron-left-CP2mo7JH.js"
	},
	"/assets/circle-x-Dl7Ydo0c.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"c3-Q/rydVHkhRftVgnQXcx+13NsSmE\"",
		"mtime": "2026-07-23T05:49:08.397Z",
		"size": 195,
		"path": "../public/assets/circle-x-Dl7Ydo0c.js"
	},
	"/assets/copy-BFw2h1D5.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"e0-00Hg1M0JaNL8fQ2ggI+FAWrGi5w\"",
		"mtime": "2026-07-23T05:49:08.397Z",
		"size": 224,
		"path": "../public/assets/copy-BFw2h1D5.js"
	},
	"/assets/dialog-Bl5cZ9T_.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"839-6nFX4HyURKwRk5ZeoTaTweRKH8k\"",
		"mtime": "2026-07-23T05:49:08.398Z",
		"size": 2105,
		"path": "../public/assets/dialog-Bl5cZ9T_.js"
	},
	"/assets/dist-B4GByWgz.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"b61c-e8ZSh2osjnGg1lJR3q/8idHiif0\"",
		"mtime": "2026-07-23T05:49:08.398Z",
		"size": 46620,
		"path": "../public/assets/dist-B4GByWgz.js"
	},
	"/assets/credit-card-ETmPSCZ3.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"c3-7QX8QV0vH+6rAiqiiWZmv/YVueY\"",
		"mtime": "2026-07-23T05:49:08.397Z",
		"size": 195,
		"path": "../public/assets/credit-card-ETmPSCZ3.js"
	},
	"/assets/dist-BmKnGWql.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"129c-JkMEu1gBLNUTvy2+Qvm32QunQ1Y\"",
		"mtime": "2026-07-23T05:49:08.399Z",
		"size": 4764,
		"path": "../public/assets/dist-BmKnGWql.js"
	},
	"/assets/dist-DDF3MNQH.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1a5e-IshfL5G0p04/6vsLDF+5eRj4jbk\"",
		"mtime": "2026-07-23T05:49:08.400Z",
		"size": 6750,
		"path": "../public/assets/dist-DDF3MNQH.js"
	},
	"/assets/dist-Adh4ssM6.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"832-yEh8wUIFauyJR47riSNpILlu9Ds\"",
		"mtime": "2026-07-23T05:49:08.398Z",
		"size": 2098,
		"path": "../public/assets/dist-Adh4ssM6.js"
	},
	"/assets/dist-Dhg5PFkB.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"b87-/Nt2TvYkgqYnTXOO0IwEt4JeAhY\"",
		"mtime": "2026-07-23T05:49:08.401Z",
		"size": 2951,
		"path": "../public/assets/dist-Dhg5PFkB.js"
	},
	"/assets/dist-lb3BV1Lv.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"de0-m12YhxUu0DQpm3606vJVqBZLIQI\"",
		"mtime": "2026-07-23T05:49:08.401Z",
		"size": 3552,
		"path": "../public/assets/dist-lb3BV1Lv.js"
	},
	"/assets/dist-DEZS4aoA.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"765d-rAyPHLq2LtdiYIXawDc4AyGOL8M\"",
		"mtime": "2026-07-23T05:49:08.400Z",
		"size": 30301,
		"path": "../public/assets/dist-DEZS4aoA.js"
	},
	"/assets/dist-C2a7wXmS.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"101-ZE4rmfqUl50r4nZivs1oZG8dlZw\"",
		"mtime": "2026-07-23T05:49:08.399Z",
		"size": 257,
		"path": "../public/assets/dist-C2a7wXmS.js"
	},
	"/assets/dropdown-menu-Ank_Dru_.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"58f7-pwetwjLEYvrOoN0UJtRW7lJM7bs\"",
		"mtime": "2026-07-23T05:49:08.402Z",
		"size": 22775,
		"path": "../public/assets/dropdown-menu-Ank_Dru_.js"
	},
	"/assets/eye-off-C7EBraZF.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1a2-etq6UMsgVSZ+XLTS2iCBLuDbOAA\"",
		"mtime": "2026-07-23T05:49:08.402Z",
		"size": 418,
		"path": "../public/assets/eye-off-C7EBraZF.js"
	},
	"/assets/globe-DeAVJRA9.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"e6-5WtnyGhi69JSWWMImvCHOEpVjXU\"",
		"mtime": "2026-07-23T05:49:08.403Z",
		"size": 230,
		"path": "../public/assets/globe-DeAVJRA9.js"
	},
	"/assets/forgot-password-eR_ixY-f.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"b43-bwofbMgI75MPxOwT9wHWdmYIa0U\"",
		"mtime": "2026-07-23T05:49:08.403Z",
		"size": 2883,
		"path": "../public/assets/forgot-password-eR_ixY-f.js"
	},
	"/assets/eye-XGppFXOW.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f4-y04tnj/I6uX1ZM6s2N3wkg7OsCM\"",
		"mtime": "2026-07-23T05:49:08.402Z",
		"size": 244,
		"path": "../public/assets/eye-XGppFXOW.js"
	},
	"/assets/input-B5hAaV97.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"26c-HAFJOYwAXwcqHDBe+SfNoe59ZXE\"",
		"mtime": "2026-07-23T05:49:08.403Z",
		"size": 620,
		"path": "../public/assets/input-B5hAaV97.js"
	},
	"/assets/download-DE6PaVDV.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"dc-S5RUut80e3hpgwaF3GcV3cAlOUI\"",
		"mtime": "2026-07-23T05:49:08.401Z",
		"size": 220,
		"path": "../public/assets/download-DE6PaVDV.js"
	},
	"/assets/key-round-BFw1J0kq.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"157-40/u/7/RexINoN9ixxmFTS3GeZk\"",
		"mtime": "2026-07-23T05:49:08.404Z",
		"size": 343,
		"path": "../public/assets/key-round-BFw1J0kq.js"
	},
	"/assets/jsx-runtime-C27Mmbu5.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2157-K7z7JulAsA1EGRDTmPYOvz5HqGU\"",
		"mtime": "2026-07-23T05:49:08.404Z",
		"size": 8535,
		"path": "../public/assets/jsx-runtime-C27Mmbu5.js"
	},
	"/assets/label-88fOckeu.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3e1-fhK/hw5HIjY/bU6+DybVvsgBdtk\"",
		"mtime": "2026-07-23T05:49:08.405Z",
		"size": 993,
		"path": "../public/assets/label-88fOckeu.js"
	},
	"/assets/layout-grid-bwG40UyG.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"14e-hCv30frwQF9L2BSt6bieCqm5kms\"",
		"mtime": "2026-07-23T05:49:08.405Z",
		"size": 334,
		"path": "../public/assets/layout-grid-bwG40UyG.js"
	},
	"/assets/lock-Chw7Ynfu.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"c2-R5QMFmKTVUrImF9j5RL+e4BYUQg\"",
		"mtime": "2026-07-23T05:49:08.406Z",
		"size": 194,
		"path": "../public/assets/lock-Chw7Ynfu.js"
	},
	"/assets/log-in-BnsHpqlI.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"db-Hjkb+x266mZhhpovLEE4vzPMLqQ\"",
		"mtime": "2026-07-23T05:49:08.407Z",
		"size": 219,
		"path": "../public/assets/log-in-BnsHpqlI.js"
	},
	"/assets/index-3XhaPVcd.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5b029-KR6/9EsHJ4pZmpHQFcpWlPoOs3U\"",
		"mtime": "2026-07-23T05:49:08.386Z",
		"size": 372777,
		"path": "../public/assets/index-3XhaPVcd.js"
	},
	"/assets/mail-BZFwOJDV.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"c9-zB9E6Qc4w4nrUanyl2v7UCZFMJU\"",
		"mtime": "2026-07-23T05:49:08.407Z",
		"size": 201,
		"path": "../public/assets/mail-BZFwOJDV.js"
	},
	"/assets/megaphone-DksBYAaz.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"14e-fiEBajyYncv7CZJxnpHrzQP7qFM\"",
		"mtime": "2026-07-23T05:49:08.407Z",
		"size": 334,
		"path": "../public/assets/megaphone-DksBYAaz.js"
	},
	"/assets/monitor-JStBiSNG.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f7-ZC0IbKuAXurBVA6sOLEo77evu/w\"",
		"mtime": "2026-07-23T05:49:08.408Z",
		"size": 247,
		"path": "../public/assets/monitor-JStBiSNG.js"
	},
	"/assets/package-ByWXKmmz.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"168-IjkbXdzwJddSNDW58Wpw0kUhRtU\"",
		"mtime": "2026-07-23T05:49:08.409Z",
		"size": 360,
		"path": "../public/assets/package-ByWXKmmz.js"
	},
	"/assets/plus-FI6GszbI.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8d-bwGmnoSNcVb9SKCpTGY2sxBVzrY\"",
		"mtime": "2026-07-23T05:49:08.409Z",
		"size": 141,
		"path": "../public/assets/plus-FI6GszbI.js"
	},
	"/assets/mock-data-CXqiay-q.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"bc0-KtSzFr5QxBg7FtYDa9eds7BfeKE\"",
		"mtime": "2026-07-23T05:49:08.408Z",
		"size": 3008,
		"path": "../public/assets/mock-data-CXqiay-q.js"
	},
	"/assets/printer-Ufr5XhaJ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"133-spqKJgqpZ5gSHVYveu4J/B9AIXk\"",
		"mtime": "2026-07-23T05:49:08.410Z",
		"size": 307,
		"path": "../public/assets/printer-Ufr5XhaJ.js"
	},
	"/assets/rotate-ccw-Bf85o5ga.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"bc-yRVeSM1B7Mnlxn9oF/MT8e79Qck\"",
		"mtime": "2026-07-23T05:49:08.413Z",
		"size": 188,
		"path": "../public/assets/rotate-ccw-Bf85o5ga.js"
	},
	"/assets/palette-rhaifzWA.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1f2-ljpxX7MmuO1nV7BKTxhKiT61dQg\"",
		"mtime": "2026-07-23T05:49:08.409Z",
		"size": 498,
		"path": "../public/assets/palette-rhaifzWA.js"
	},
	"/assets/react-dom-BGozS2fx.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"dda-0MZBIJvXSnBp/LkUj2JpcVxRM3E\"",
		"mtime": "2026-07-23T05:49:08.412Z",
		"size": 3546,
		"path": "../public/assets/react-dom-BGozS2fx.js"
	},
	"/assets/refresh-cw-bZzMCMVs.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"135-6HN6o+n8fXh4N+hoJYxc5wCzBHA\"",
		"mtime": "2026-07-23T05:49:08.412Z",
		"size": 309,
		"path": "../public/assets/refresh-cw-bZzMCMVs.js"
	},
	"/assets/save-CIAokKeg.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"13b-I0Hu1qsFfT0zONKKHbaWMCfnTtc\"",
		"mtime": "2026-07-23T05:49:08.413Z",
		"size": 315,
		"path": "../public/assets/save-CIAokKeg.js"
	},
	"/assets/routes-DrLZpMtz.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"185e-8oGlzgc3PbbKsUf90A9pYIgfIeY\"",
		"mtime": "2026-07-23T05:49:08.413Z",
		"size": 6238,
		"path": "../public/assets/routes-DrLZpMtz.js"
	},
	"/assets/search-DpjnRboO.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a2-RwhrmJe55P3Uc2Ok5X6mNBw6Ho4\"",
		"mtime": "2026-07-23T05:49:08.414Z",
		"size": 162,
		"path": "../public/assets/search-DpjnRboO.js"
	},
	"/assets/shield-check-WsQZcoZN.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"134-aQ6e3mE5PZp2zl2aSUGhNo/3Wf4\"",
		"mtime": "2026-07-23T05:49:08.415Z",
		"size": 308,
		"path": "../public/assets/shield-check-WsQZcoZN.js"
	},
	"/assets/shield-CXgrCM5Y.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"104-xGKIXRat0G5XbK26zAzew6bZeSo\"",
		"mtime": "2026-07-23T05:49:08.415Z",
		"size": 260,
		"path": "../public/assets/shield-CXgrCM5Y.js"
	},
	"/assets/shield-off-Dr6nfbk0.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"184-/tKAChHUrgsbl2COltYOuR0gnPw\"",
		"mtime": "2026-07-23T05:49:08.415Z",
		"size": 388,
		"path": "../public/assets/shield-off-Dr6nfbk0.js"
	},
	"/assets/select-DSxH11I4.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"575b-69yvKr97ZA4Ks0aOa37GVmehQGA\"",
		"mtime": "2026-07-23T05:49:08.414Z",
		"size": 22363,
		"path": "../public/assets/select-DSxH11I4.js"
	},
	"/assets/stat-card-MhR6KeiW.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"57b-xtxya6j2Pihtg9Y0YyV5M4rIawI\"",
		"mtime": "2026-07-23T05:49:08.416Z",
		"size": 1403,
		"path": "../public/assets/stat-card-MhR6KeiW.js"
	},
	"/assets/status-badge-CXmMJQkA.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"367-PLG+tyXxw17hiI05e38h//EdiPw\"",
		"mtime": "2026-07-23T05:49:08.416Z",
		"size": 871,
		"path": "../public/assets/status-badge-CXmMJQkA.js"
	},
	"/assets/sparkles-CFemFaie.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1e2-HyttjcIfmM9ewaov3XsMbzMz9e8\"",
		"mtime": "2026-07-23T05:49:08.415Z",
		"size": 482,
		"path": "../public/assets/sparkles-CFemFaie.js"
	},
	"/assets/styles--9dpc57i.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"1de54-XCVMiD1Y6AauKupVNHyx6VrWNDk\"",
		"mtime": "2026-07-23T05:49:08.422Z",
		"size": 122452,
		"path": "../public/assets/styles--9dpc57i.css"
	},
	"/assets/PieChart-JVfcNOkJ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"61407-NZdnS/+EgLWZf9r8G8i7IbOhS6U\"",
		"mtime": "2026-07-23T05:49:08.387Z",
		"size": 398343,
		"path": "../public/assets/PieChart-JVfcNOkJ.js"
	},
	"/assets/table-CTvgedxE.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"66b-I/n4aWHjMtOTaD2Op9JEhhcudd4\"",
		"mtime": "2026-07-23T05:49:08.417Z",
		"size": 1643,
		"path": "../public/assets/table-CTvgedxE.js"
	},
	"/assets/tabs-D62MvKrP.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"d69-1bHhQB2clHkf7tYXJ774g8dK9Fc\"",
		"mtime": "2026-07-23T05:49:08.418Z",
		"size": 3433,
		"path": "../public/assets/tabs-D62MvKrP.js"
	},
	"/assets/switch-0rCYyMZg.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a1a-TzrkQemyCeqBnOSQV1cAwoZ5Ug0\"",
		"mtime": "2026-07-23T05:49:08.417Z",
		"size": 2586,
		"path": "../public/assets/switch-0rCYyMZg.js"
	},
	"/assets/triangle-alert-CCMIwTOO.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"fd-8otymG6x647qXEXietd8cn7Td3M\"",
		"mtime": "2026-07-23T05:49:08.419Z",
		"size": 253,
		"path": "../public/assets/triangle-alert-CCMIwTOO.js"
	},
	"/assets/textarea-BxmXjk8n.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"206-ygUdllh8t/UuzdU0GaztZD85Bek\"",
		"mtime": "2026-07-23T05:49:08.418Z",
		"size": 518,
		"path": "../public/assets/textarea-BxmXjk8n.js"
	},
	"/assets/trash-2-J8L2GSzN.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"13c-nVYjmXYGKTpB990nrfT0INcOfp4\"",
		"mtime": "2026-07-23T05:49:08.418Z",
		"size": 316,
		"path": "../public/assets/trash-2-J8L2GSzN.js"
	},
	"/assets/user-plus-jvQ0jxQs.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"12a-rqrlBPk7BU9+On9m7fBVD6u9SPA\"",
		"mtime": "2026-07-23T05:49:08.420Z",
		"size": 298,
		"path": "../public/assets/user-plus-jvQ0jxQs.js"
	},
	"/assets/wallet-B9ft_1H9.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"112-3zHwql41o+QMXfpELhPfcwBnQZs\"",
		"mtime": "2026-07-23T05:49:08.420Z",
		"size": 274,
		"path": "../public/assets/wallet-B9ft_1H9.js"
	},
	"/assets/users-B6iE9RDq.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"126-Oy0TtDYm+L1yJxxJxZNG/vrQmkE\"",
		"mtime": "2026-07-23T05:49:08.420Z",
		"size": 294,
		"path": "../public/assets/users-B6iE9RDq.js"
	},
	"/assets/upload-ZhyEogqM.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1b2-ZmTanadGxKUarFTyAo4sQD5WE38\"",
		"mtime": "2026-07-23T05:49:08.419Z",
		"size": 434,
		"path": "../public/assets/upload-ZhyEogqM.js"
	},
	"/pos/.last_build_id": {
		"type": "text/plain; charset=utf-8",
		"etag": "\"20-ML4koF3CWK6XiLlGBRhLpReO/mA\"",
		"mtime": "2026-07-11T05:33:44.460Z",
		"size": 32,
		"path": "../public/pos/.last_build_id"
	},
	"/assets/zap-tyunHNqo.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"fa-MfA1r9ZciVDtUQnZYyHOHfkkqY8\"",
		"mtime": "2026-07-23T05:49:08.420Z",
		"size": 250,
		"path": "../public/assets/zap-tyunHNqo.js"
	},
	"/pos/favicon.png": {
		"type": "image/png",
		"etag": "\"395-YaZ3V+0+ASndzNpun6DfJV7pKWI\"",
		"mtime": "2026-02-09T09:10:05.406Z",
		"size": 917,
		"path": "../public/pos/favicon.png"
	},
	"/pos/flutter.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"24c4-xDPnpI/cx6lXNyPCgCvQg0Manmk\"",
		"mtime": "2026-02-09T09:08:33.517Z",
		"size": 9412,
		"path": "../public/pos/flutter.js"
	},
	"/pos/flutter_service_worker.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2111-lpaiJCmsO6FQfj9NlcrV9aF5Y0Q\"",
		"mtime": "2026-07-11T10:34:17.413Z",
		"size": 8465,
		"path": "../public/pos/flutter_service_worker.js"
	},
	"/pos/flutter_bootstrap.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"260b-Zn8oIGa4bFV+8JWVDnc4DuCFfrE\"",
		"mtime": "2026-07-11T10:33:08.556Z",
		"size": 9739,
		"path": "../public/pos/flutter_bootstrap.js"
	},
	"/pos/index.html": {
		"type": "text/html; charset=utf-8",
		"etag": "\"4cd-yOI6IkNga+q/bW2F283Y/ZQ2zaM\"",
		"mtime": "2026-07-11T10:33:08.567Z",
		"size": 1229,
		"path": "../public/pos/index.html"
	},
	"/pos/manifest.json": {
		"type": "application/json",
		"etag": "\"3a9-9GOphuoIx6hp4YNcaWvwEY1Ph9c\"",
		"mtime": "2026-07-03T09:04:59.392Z",
		"size": 937,
		"path": "../public/pos/manifest.json"
	},
	"/pos/version.json": {
		"type": "application/json",
		"etag": "\"4c-N71zspoeq5ZW+ME/2uhc8I7Vo7Q\"",
		"mtime": "2026-07-11T10:34:11.689Z",
		"size": 76,
		"path": "../public/pos/version.json"
	},
	"/pos/assets/FontManifest.json": {
		"type": "application/json",
		"etag": "\"d0-vKJkVIcw+LGHFnKJGwrQwCREv68\"",
		"mtime": "2026-07-11T10:34:11.886Z",
		"size": 208,
		"path": "../public/pos/assets/FontManifest.json"
	},
	"/pos/assets/AssetManifest.bin.json": {
		"type": "application/json",
		"etag": "\"9e-MlABXPzEcShfHMHGmsiRJAe9ZCc\"",
		"mtime": "2026-07-11T10:34:11.886Z",
		"size": 158,
		"path": "../public/pos/assets/AssetManifest.bin.json"
	},
	"/pos/icons/Icon-192.png": {
		"type": "image/png",
		"etag": "\"14ac-KTsoJcidKr1LF+L1rDDDD1ujck8\"",
		"mtime": "2026-02-09T09:10:05.427Z",
		"size": 5292,
		"path": "../public/pos/icons/Icon-192.png"
	},
	"/pos/assets/AssetManifest.bin": {
		"type": "application/octet-stream",
		"etag": "\"75-ME0cAg6cl/bTZmwXEVgMugDccUI\"",
		"mtime": "2026-07-11T10:34:11.886Z",
		"size": 117,
		"path": "../public/pos/assets/AssetManifest.bin"
	},
	"/pos/icons/Icon-512.png": {
		"type": "image/png",
		"etag": "\"203c-s/wSKxK0f5kl3q+BWKjmMLYQ1iI\"",
		"mtime": "2026-02-09T09:10:05.430Z",
		"size": 8252,
		"path": "../public/pos/icons/Icon-512.png"
	},
	"/pos/icons/Icon-maskable-512.png": {
		"type": "image/png",
		"etag": "\"5206-AyLkxRgBQJTtLJnZYo0u+XvibxQ\"",
		"mtime": "2026-05-01T08:46:50.818Z",
		"size": 20998,
		"path": "../public/pos/icons/Icon-maskable-512.png"
	},
	"/pos/icons/Icon-maskable-192.png": {
		"type": "image/png",
		"etag": "\"15da-mhk9paToQkjFB6RxSw/j1V+ywik\"",
		"mtime": "2026-05-01T08:46:50.883Z",
		"size": 5594,
		"path": "../public/pos/icons/Icon-maskable-192.png"
	},
	"/pos/assets/NOTICES": {
		"type": "text/plain; charset=utf-8",
		"etag": "\"149b97-or6TvSQeVagx0SFleUvQc871L+w\"",
		"mtime": "2026-07-11T10:34:11.887Z",
		"size": 1350551,
		"path": "../public/pos/assets/NOTICES"
	},
	"/pos/canvaskit/canvaskit.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1525b-PsKIBVIwMQlh4APncU1MAE7RjV8\"",
		"mtime": "2026-02-09T09:08:33.253Z",
		"size": 86619,
		"path": "../public/pos/canvaskit/canvaskit.js"
	},
	"/pos/canvaskit/skwasm.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"ecf1-tRuMj38r31LgaKOQ1MxvFmEyw/o\"",
		"mtime": "2026-02-09T09:08:33.324Z",
		"size": 60657,
		"path": "../public/pos/canvaskit/skwasm.js"
	},
	"/pos/canvaskit/skwasm_heavy.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"ed62-33FPz4cMaFIhnNEoI9SHEmiC/iY\"",
		"mtime": "2026-02-09T09:08:33.373Z",
		"size": 60770,
		"path": "../public/pos/canvaskit/skwasm_heavy.js"
	},
	"/pos/assets/fonts/MaterialIcons-Regular.otf": {
		"type": "font/otf",
		"etag": "\"4208-qjBqi6nM/CBG/bgTCwK8dMQ1NNg\"",
		"mtime": "2026-07-11T10:34:13.792Z",
		"size": 16904,
		"path": "../public/pos/assets/fonts/MaterialIcons-Regular.otf"
	},
	"/pos/assets/shaders/stretch_effect.frag": {
		"type": "text/plain; charset=utf-8",
		"etag": "\"1a3a-J9VT8tcWw/b73syjQcb3cqUjF/k\"",
		"mtime": "2026-07-11T10:34:12.053Z",
		"size": 6714,
		"path": "../public/pos/assets/shaders/stretch_effect.frag"
	},
	"/pos/assets/shaders/ink_sparkle.frag": {
		"type": "text/plain; charset=utf-8",
		"etag": "\"22a3-BAcbaDgtwi88NROq1gDUpFvSaZc\"",
		"mtime": "2026-07-11T10:34:12.056Z",
		"size": 8867,
		"path": "../public/pos/assets/shaders/ink_sparkle.frag"
	},
	"/pos/assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": {
		"type": "font/ttf",
		"etag": "\"5c0-LnbHDQn7HY5s/Zxk96YDhyJEWcI\"",
		"mtime": "2026-07-11T10:34:13.789Z",
		"size": 1472,
		"path": "../public/pos/assets/packages/cupertino_icons/assets/CupertinoIcons.ttf"
	},
	"/pos/canvaskit/chromium/canvaskit.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"150f0-zxwQZA/TcqjcgTaWRESahPX3pPs\"",
		"mtime": "2026-02-09T09:08:33.439Z",
		"size": 86256,
		"path": "../public/pos/canvaskit/chromium/canvaskit.js"
	},
	"/pos/canvaskit/skwasm.js.symbols": {
		"type": "text/plain; charset=utf-8",
		"etag": "\"172e28-KOIUrPi4nIWlDZE/NYstt4tvNEo\"",
		"mtime": "2026-02-09T09:08:33.335Z",
		"size": 1519144,
		"path": "../public/pos/canvaskit/skwasm.js.symbols"
	},
	"/pos/canvaskit/canvaskit.js.symbols": {
		"type": "text/plain; charset=utf-8",
		"etag": "\"1478f0-bCxRtl1GqwAhWTE5BY113MJcOWM\"",
		"mtime": "2026-02-09T09:08:33.263Z",
		"size": 1341680,
		"path": "../public/pos/canvaskit/canvaskit.js.symbols"
	},
	"/pos/canvaskit/chromium/canvaskit.js.symbols": {
		"type": "text/plain; charset=utf-8",
		"etag": "\"1347cc-a0M83YGoQfyamsTDTMaNlzbb1uc\"",
		"mtime": "2026-02-09T09:08:33.448Z",
		"size": 1263564,
		"path": "../public/pos/canvaskit/chromium/canvaskit.js.symbols"
	},
	"/pos/main.dart.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"345715-+dVqvemeR9JqQ9TaNzqfFulXGXA\"",
		"mtime": "2026-07-11T10:33:51.597Z",
		"size": 3430165,
		"path": "../public/pos/main.dart.js"
	},
	"/pos/canvaskit/skwasm_heavy.js.symbols": {
		"type": "text/plain; charset=utf-8",
		"etag": "\"18ff5b-y27IXOqGvt0GP3280l+/3X1D8xM\"",
		"mtime": "2026-02-09T09:08:33.386Z",
		"size": 1638235,
		"path": "../public/pos/canvaskit/skwasm_heavy.js.symbols"
	},
	"/pos/canvaskit/skwasm.wasm": {
		"type": "application/wasm",
		"etag": "\"36324c-vMTjBv89CafGXs4pyBVszryDI2g\"",
		"mtime": "2026-02-09T09:08:33.368Z",
		"size": 3551820,
		"path": "../public/pos/canvaskit/skwasm.wasm"
	},
	"/pos/canvaskit/skwasm_heavy.wasm": {
		"type": "application/wasm",
		"etag": "\"4d0410-wueUlxZ7ceEEV1BQDlnfWSc+0XM\"",
		"mtime": "2026-02-09T09:08:33.430Z",
		"size": 5047312,
		"path": "../public/pos/canvaskit/skwasm_heavy.wasm"
	},
	"/pos/canvaskit/chromium/canvaskit.wasm": {
		"type": "application/wasm",
		"etag": "\"571c9b-slm//xeI/0bsYj/2CBbxrG/AGng\"",
		"mtime": "2026-02-09T09:08:33.503Z",
		"size": 5708955,
		"path": "../public/pos/canvaskit/chromium/canvaskit.wasm"
	},
	"/pos/canvaskit/canvaskit.wasm": {
		"type": "application/wasm",
		"etag": "\"6c16f8-h28dRpnTMXMUIeWUar69XBYFVXc\"",
		"mtime": "2026-02-09T09:08:33.320Z",
		"size": 7083768,
		"path": "../public/pos/canvaskit/canvaskit.wasm"
	}
};
//#endregion
//#region #nitro/virtual/public-assets
var publicAssetBases = {};
function isPublicAssetURL(id = "") {
	if (public_assets_data_default[id]) return true;
	for (const base in publicAssetBases) if (id.startsWith(base)) return true;
	return false;
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/route-rules.mjs
var headers = ((m) => function headersRouteRule(event) {
	for (const [key, value] of Object.entries(m.options || {})) event.res.headers.set(key, value);
});
//#endregion
//#region #nitro/virtual/routing
var findRouteRules = /* @__PURE__ */ (() => {
	const $0 = [{
		name: "headers",
		route: "/assets/**",
		handler: headers,
		options: { "cache-control": "public, max-age=31536000, immutable" }
	}];
	return (m, p) => {
		let r = [];
		if (p.charCodeAt(p.length - 1) === 47) p = p.slice(0, -1) || "/";
		let s = p.split("/");
		if (s.length > 1) {
			if (s[1] === "assets") r.unshift({
				data: $0,
				params: { "_": s.slice(2).join("/") }
			});
		}
		return r;
	};
})();
var _lazy_NbB6nE = defineLazyEventHandler(() => import("./_chunks/ssr-renderer.mjs"));
var findRoute = /* @__PURE__ */ (() => {
	const data = {
		route: "/**",
		handler: _lazy_NbB6nE
	};
	return ((_m, p) => {
		return {
			data,
			params: { "_": p.slice(1) }
		};
	});
})();
[].filter(Boolean);
//#endregion
//#region node_modules/nitro/dist/runtime/internal/error/prod.mjs
var errorHandler = (error, event) => {
	const res = defaultHandler(error, event);
	return new FastResponse(typeof res.body === "string" ? res.body : JSON.stringify(res.body, null, 2), res);
};
function defaultHandler(error, event) {
	const unhandled = error.unhandled ?? !HTTPError.isError(error);
	const { status = 500, statusText = "" } = unhandled ? {} : error;
	if (status === 404) {
		const url = event.url || new URL(event.req.url);
		const baseURL = "/";
		if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) return {
			status: 302,
			headers: new Headers({ location: `${baseURL}${url.pathname.slice(1)}${url.search}` })
		};
	}
	const headers = new Headers(unhandled ? {} : error.headers);
	headers.set("content-type", "application/json; charset=utf-8");
	return {
		status,
		statusText,
		headers,
		body: {
			error: true,
			...unhandled ? {
				status,
				unhandled: true
			} : typeof error.toJSON === "function" ? error.toJSON() : {
				status,
				statusText,
				message: error.message
			}
		}
	};
}
//#endregion
//#region #nitro/virtual/error-handler
var errorHandlers = [errorHandler];
async function error_handler_default(error, event) {
	for (const handler of errorHandlers) try {
		const response = await handler(error, event, { defaultHandler });
		if (response) return response;
	} catch (error) {
		console.error(error);
	}
}
//#endregion
//#region #nitro/virtual/app
function createNitroApp() {
	const captureError = (error, errorCtx) => {
		if (errorCtx?.event) {
			const errors = errorCtx.event.req.context?.nitro?.errors;
			if (errors) errors.push({
				error,
				context: errorCtx
			});
		}
	};
	const h3App = createH3App({ onError(error, event) {
		return error_handler_default(error, event);
	} });
	let appHandler = (req) => {
		req.context ||= {};
		req.context.nitro = req.context.nitro || { errors: [] };
		return h3App.fetch(req);
	};
	return {
		fetch: appHandler,
		h3: h3App,
		hooks: void 0,
		captureError
	};
}
function createH3App(config) {
	const h3App = new H3Core(config);
	h3App["~findRoute"] = (event) => findRoute(event.req.method, event.url.pathname);
	h3App["~getMiddleware"] = (event, route) => {
		const pathname = event.url.pathname;
		const method = event.req.method;
		const middleware = [];
		const routeRules = getRouteRules(method, pathname);
		event.context.routeRules = routeRules?.routeRules;
		if (routeRules?.routeRuleMiddleware.length) middleware.push(...routeRules.routeRuleMiddleware);
		if (route?.data?.middleware?.length) middleware.push(...route.data.middleware);
		return middleware;
	};
	return h3App;
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/app.mjs
var APP_ID = "default";
function useNitroApp() {
	let instance = useNitroApp._instance;
	if (instance) return instance;
	instance = useNitroApp._instance = createNitroApp();
	globalThis.__nitro__ = globalThis.__nitro__ || {};
	globalThis.__nitro__[APP_ID] = instance;
	return instance;
}
function useNitroHooks() {
	const nitroApp = useNitroApp();
	const hooks = nitroApp.hooks;
	if (hooks) return hooks;
	return nitroApp.hooks = new HookableCore();
}
function getRouteRules(method, pathname) {
	const m = findRouteRules(method, pathname);
	if (!m?.length) return { routeRuleMiddleware: [] };
	const routeRules = {};
	for (const layer of m) for (const rule of layer.data) {
		const currentRule = routeRules[rule.name];
		if (currentRule) {
			if (rule.options === false) {
				delete routeRules[rule.name];
				continue;
			}
			if (typeof currentRule.options === "object" && typeof rule.options === "object") currentRule.options = {
				...currentRule.options,
				...rule.options
			};
			else currentRule.options = rule.options;
			currentRule.route = rule.route;
			currentRule.params = {
				...currentRule.params,
				...layer.params
			};
		} else if (rule.options !== false) routeRules[rule.name] = {
			...rule,
			params: layer.params
		};
	}
	const middleware = [];
	const orderedRules = Object.values(routeRules).sort((a, b) => (a.handler?.order || 0) - (b.handler?.order || 0));
	for (const rule of orderedRules) {
		if (rule.options === false || !rule.handler) continue;
		middleware.push(rule.handler(rule));
	}
	return {
		routeRules,
		routeRuleMiddleware: middleware
	};
}
//#endregion
//#region node_modules/nitro/dist/presets/cloudflare/runtime/_module-handler.mjs
function createHandler(hooks) {
	const nitroApp = useNitroApp();
	const nitroHooks = useNitroHooks();
	return {
		async fetch(request, env, context) {
			globalThis.__env__ = env;
			augmentReq(request, {
				env,
				context
			});
			const ctxExt = {};
			const url = new URL(request.url);
			if (hooks.fetch) {
				const res = await hooks.fetch(request, env, context, url, ctxExt);
				if (res) return res;
			}
			return await nitroApp.fetch(request);
		},
		scheduled(controller, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:scheduled", {
				controller,
				env,
				context
			}) || Promise.resolve());
		},
		email(message, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:email", {
				message,
				event: message,
				env,
				context
			}) || Promise.resolve());
		},
		queue(batch, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:queue", {
				batch,
				event: batch,
				env,
				context
			}) || Promise.resolve());
		},
		tail(traces, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:tail", {
				traces,
				env,
				context
			}) || Promise.resolve());
		},
		trace(traces, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:trace", {
				traces,
				env,
				context
			}) || Promise.resolve());
		}
	};
}
function augmentReq(cfReq, ctx) {
	const req = cfReq;
	req.ip = cfReq.headers.get("cf-connecting-ip") || void 0;
	req.runtime ??= { name: "cloudflare" };
	req.runtime.cloudflare = {
		...req.runtime.cloudflare,
		...ctx
	};
	req.waitUntil = ctx.context?.waitUntil.bind(ctx.context);
}
//#endregion
//#region node_modules/nitro/dist/presets/cloudflare/runtime/cloudflare-module.mjs
var cloudflare_module_default = createHandler({ fetch(cfRequest, env, context, url) {
	if (env.ASSETS && isPublicAssetURL(url.pathname)) return env.ASSETS.fetch(cfRequest);
} });
//#endregion
export { cloudflare_module_default as default };
