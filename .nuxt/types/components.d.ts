
import type { DefineComponent, SlotsType } from 'vue'
type IslandComponent<T> = DefineComponent<{}, {refresh: () => Promise<void>}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, SlotsType<{ fallback: { error: unknown } }>> & T

type HydrationStrategies = {
  hydrateOnVisible?: IntersectionObserverInit | true
  hydrateOnIdle?: number | true
  hydrateOnInteraction?: keyof HTMLElementEventMap | Array<keyof HTMLElementEventMap> | true
  hydrateOnMediaQuery?: string
  hydrateAfter?: number
  hydrateWhen?: boolean
  hydrateNever?: true
}
type LazyComponent<T> = DefineComponent<HydrationStrategies, {}, {}, {}, {}, {}, {}, { hydrated: () => void }> & T

interface _GlobalComponents {
  ErrorAlert: typeof import("../../components/ErrorAlert.vue")['default']
  Footer: typeof import("../../components/Footer.vue")['default']
  Header: typeof import("../../components/Header.vue")['default']
  LoadingSpinner: typeof import("../../components/LoadingSpinner.vue")['default']
  SkeletonImage: typeof import("../../components/SkeletonImage.vue")['default']
  AdminDashboard: typeof import("../../components/admin/AdminDashboard.vue")['default']
  AdminLayout: typeof import("../../components/admin/AdminLayout.vue")['default']
  AdminLoginPage: typeof import("../../components/admin/LoginPage.vue")['default']
  CompetitionsAdminCompetitionList: typeof import("../../components/competitions/AdminCompetitionList.vue")['default']
  CompetitionsCompetitionForm: typeof import("../../components/competitions/CompetitionForm.vue")['default']
  ContactAdminContactList: typeof import("../../components/contact/AdminContactList.vue")['default']
  ContactForm: typeof import("../../components/contact/ContactForm.vue")['default']
  HorsesAdminHorseList: typeof import("../../components/horses/AdminHorseList.vue")['default']
  HorsesAdminRacehorseList: typeof import("../../components/horses/AdminRacehorseList.vue")['default']
  HorsesHorseCard: typeof import("../../components/horses/HorseCard.vue")['default']
  HorsesHorseFilter: typeof import("../../components/horses/HorseFilter.vue")['default']
  HorsesHorseForm: typeof import("../../components/horses/HorseForm.vue")['default']
  HorsesHorseGallery: typeof import("../../components/horses/HorseGallery.vue")['default']
  HorsesHorseImageGallery: typeof import("../../components/horses/HorseImageGallery.vue")['default']
  HorsesHorseImageUpload: typeof import("../../components/horses/HorseImageUpload.vue")['default']
  HorsesPedigreeTree: typeof import("../../components/horses/PedigreeTree.vue")['default']
  IconsIconCommunity: typeof import("../../components/icons/IconCommunity.vue")['default']
  IconsIconDocumentation: typeof import("../../components/icons/IconDocumentation.vue")['default']
  IconsIconEcosystem: typeof import("../../components/icons/IconEcosystem.vue")['default']
  IconsIconSupport: typeof import("../../components/icons/IconSupport.vue")['default']
  IconsIconTooling: typeof import("../../components/icons/IconTooling.vue")['default']
  OrdersAdminOrderList: typeof import("../../components/orders/AdminOrderList.vue")['default']
  OrdersOrderLookup: typeof import("../../components/orders/OrderLookup.vue")['default']
  OrdersOrderStatusBadge: typeof import("../../components/orders/OrderStatusBadge.vue")['default']
  PagesHorsesPage: typeof import("../../components/pages/HorsesPage.vue")['default']
  PagesResultsPage: typeof import("../../components/pages/ResultsPage.vue")['default']
  PagesRolunkPage: typeof import("../../components/pages/RolunkPage.vue")['default']
  ProductsAdminCategoryList: typeof import("../../components/products/AdminCategoryList.vue")['default']
  ProductsAdminProductList: typeof import("../../components/products/AdminProductList.vue")['default']
  ProductsCategoryForm: typeof import("../../components/products/CategoryForm.vue")['default']
  ProductsProductForm: typeof import("../../components/products/ProductForm.vue")['default']
  WebshopCartIcon: typeof import("../../components/webshop/CartIcon.vue")['default']
  WebshopPaginationBar: typeof import("../../components/webshop/PaginationBar.vue")['default']
  WebshopPriceRangeSlider: typeof import("../../components/webshop/PriceRangeSlider.vue")['default']
  WebshopProductCard: typeof import("../../components/webshop/ProductCard.vue")['default']
  WebshopProductFilter: typeof import("../../components/webshop/ProductFilter.vue")['default']
  NuxtWelcome: typeof import("../../node_modules/nuxt/dist/app/components/welcome.vue")['default']
  NuxtLayout: typeof import("../../node_modules/nuxt/dist/app/components/nuxt-layout")['default']
  NuxtErrorBoundary: typeof import("../../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']
  ClientOnly: typeof import("../../node_modules/nuxt/dist/app/components/client-only")['default']
  DevOnly: typeof import("../../node_modules/nuxt/dist/app/components/dev-only")['default']
  ServerPlaceholder: typeof import("../../node_modules/nuxt/dist/app/components/server-placeholder")['default']
  NuxtLink: typeof import("../../node_modules/nuxt/dist/app/components/nuxt-link")['default']
  NuxtLoadingIndicator: typeof import("../../node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']
  NuxtTime: typeof import("../../node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']
  NuxtRouteAnnouncer: typeof import("../../node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']
  NuxtImg: typeof import("../../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']
  NuxtPicture: typeof import("../../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']
  NuxtPage: typeof import("../../node_modules/nuxt/dist/pages/runtime/page")['default']
  NoScript: typeof import("../../node_modules/nuxt/dist/head/runtime/components")['NoScript']
  Link: typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Link']
  Base: typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Base']
  Title: typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Title']
  Meta: typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Meta']
  Style: typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Style']
  Head: typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Head']
  Html: typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Html']
  Body: typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Body']
  NuxtIsland: typeof import("../../node_modules/nuxt/dist/app/components/nuxt-island")['default']
  LazyErrorAlert: LazyComponent<typeof import("../../components/ErrorAlert.vue")['default']>
  LazyFooter: LazyComponent<typeof import("../../components/Footer.vue")['default']>
  LazyHeader: LazyComponent<typeof import("../../components/Header.vue")['default']>
  LazyLoadingSpinner: LazyComponent<typeof import("../../components/LoadingSpinner.vue")['default']>
  LazySkeletonImage: LazyComponent<typeof import("../../components/SkeletonImage.vue")['default']>
  LazyAdminDashboard: LazyComponent<typeof import("../../components/admin/AdminDashboard.vue")['default']>
  LazyAdminLayout: LazyComponent<typeof import("../../components/admin/AdminLayout.vue")['default']>
  LazyAdminLoginPage: LazyComponent<typeof import("../../components/admin/LoginPage.vue")['default']>
  LazyCompetitionsAdminCompetitionList: LazyComponent<typeof import("../../components/competitions/AdminCompetitionList.vue")['default']>
  LazyCompetitionsCompetitionForm: LazyComponent<typeof import("../../components/competitions/CompetitionForm.vue")['default']>
  LazyContactAdminContactList: LazyComponent<typeof import("../../components/contact/AdminContactList.vue")['default']>
  LazyContactForm: LazyComponent<typeof import("../../components/contact/ContactForm.vue")['default']>
  LazyHorsesAdminHorseList: LazyComponent<typeof import("../../components/horses/AdminHorseList.vue")['default']>
  LazyHorsesAdminRacehorseList: LazyComponent<typeof import("../../components/horses/AdminRacehorseList.vue")['default']>
  LazyHorsesHorseCard: LazyComponent<typeof import("../../components/horses/HorseCard.vue")['default']>
  LazyHorsesHorseFilter: LazyComponent<typeof import("../../components/horses/HorseFilter.vue")['default']>
  LazyHorsesHorseForm: LazyComponent<typeof import("../../components/horses/HorseForm.vue")['default']>
  LazyHorsesHorseGallery: LazyComponent<typeof import("../../components/horses/HorseGallery.vue")['default']>
  LazyHorsesHorseImageGallery: LazyComponent<typeof import("../../components/horses/HorseImageGallery.vue")['default']>
  LazyHorsesHorseImageUpload: LazyComponent<typeof import("../../components/horses/HorseImageUpload.vue")['default']>
  LazyHorsesPedigreeTree: LazyComponent<typeof import("../../components/horses/PedigreeTree.vue")['default']>
  LazyIconsIconCommunity: LazyComponent<typeof import("../../components/icons/IconCommunity.vue")['default']>
  LazyIconsIconDocumentation: LazyComponent<typeof import("../../components/icons/IconDocumentation.vue")['default']>
  LazyIconsIconEcosystem: LazyComponent<typeof import("../../components/icons/IconEcosystem.vue")['default']>
  LazyIconsIconSupport: LazyComponent<typeof import("../../components/icons/IconSupport.vue")['default']>
  LazyIconsIconTooling: LazyComponent<typeof import("../../components/icons/IconTooling.vue")['default']>
  LazyOrdersAdminOrderList: LazyComponent<typeof import("../../components/orders/AdminOrderList.vue")['default']>
  LazyOrdersOrderLookup: LazyComponent<typeof import("../../components/orders/OrderLookup.vue")['default']>
  LazyOrdersOrderStatusBadge: LazyComponent<typeof import("../../components/orders/OrderStatusBadge.vue")['default']>
  LazyPagesHorsesPage: LazyComponent<typeof import("../../components/pages/HorsesPage.vue")['default']>
  LazyPagesResultsPage: LazyComponent<typeof import("../../components/pages/ResultsPage.vue")['default']>
  LazyPagesRolunkPage: LazyComponent<typeof import("../../components/pages/RolunkPage.vue")['default']>
  LazyProductsAdminCategoryList: LazyComponent<typeof import("../../components/products/AdminCategoryList.vue")['default']>
  LazyProductsAdminProductList: LazyComponent<typeof import("../../components/products/AdminProductList.vue")['default']>
  LazyProductsCategoryForm: LazyComponent<typeof import("../../components/products/CategoryForm.vue")['default']>
  LazyProductsProductForm: LazyComponent<typeof import("../../components/products/ProductForm.vue")['default']>
  LazyWebshopCartIcon: LazyComponent<typeof import("../../components/webshop/CartIcon.vue")['default']>
  LazyWebshopPaginationBar: LazyComponent<typeof import("../../components/webshop/PaginationBar.vue")['default']>
  LazyWebshopPriceRangeSlider: LazyComponent<typeof import("../../components/webshop/PriceRangeSlider.vue")['default']>
  LazyWebshopProductCard: LazyComponent<typeof import("../../components/webshop/ProductCard.vue")['default']>
  LazyWebshopProductFilter: LazyComponent<typeof import("../../components/webshop/ProductFilter.vue")['default']>
  LazyNuxtWelcome: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/welcome.vue")['default']>
  LazyNuxtLayout: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-layout")['default']>
  LazyNuxtErrorBoundary: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']>
  LazyClientOnly: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/client-only")['default']>
  LazyDevOnly: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/dev-only")['default']>
  LazyServerPlaceholder: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/server-placeholder")['default']>
  LazyNuxtLink: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-link")['default']>
  LazyNuxtLoadingIndicator: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']>
  LazyNuxtTime: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']>
  LazyNuxtRouteAnnouncer: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']>
  LazyNuxtImg: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']>
  LazyNuxtPicture: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']>
  LazyNuxtPage: LazyComponent<typeof import("../../node_modules/nuxt/dist/pages/runtime/page")['default']>
  LazyNoScript: LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['NoScript']>
  LazyLink: LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Link']>
  LazyBase: LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Base']>
  LazyTitle: LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Title']>
  LazyMeta: LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Meta']>
  LazyStyle: LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Style']>
  LazyHead: LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Head']>
  LazyHtml: LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Html']>
  LazyBody: LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Body']>
  LazyNuxtIsland: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-island")['default']>
}

declare module 'vue' {
  export interface GlobalComponents extends _GlobalComponents { }
}

export {}
