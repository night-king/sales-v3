import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import enCommon from './en/common.json'
import enMenu from './en/menu.json'
import zhCommon from './zh/common.json'
import zhMenu from './zh/menu.json'

i18n.use(initReactI18next).init({
  resources: {
    en: { common: enCommon, menu: enMenu },
    zh: { common: zhCommon, menu: zhMenu },
  },
  lng: 'en',
  fallbackLng: 'en',
  defaultNS: 'common',
  interpolation: { escapeValue: false },
})

export default i18n
