
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


export const ErrorAlert: typeof import("../components/ErrorAlert.vue")['default']
export const Footer: typeof import("../components/Footer.vue")['default']
export const Header: typeof import("../components/Header.vue")['default']
export const LoadingSpinner: typeof import("../components/LoadingSpinner.vue")['default']
export const SkeletonImage: typeof import("../components/SkeletonImage.vue")['default']
export const AdminDashboard: typeof import("../components/admin/AdminDashboard.vue")['default']
export const AdminLayout: typeof import("../components/admin/AdminLayout.vue")['default']
export const AdminLoginPage: typeof import("../components/admin/LoginPage.vue")['default']
export const CompetitionsAdminCompetitionList: typeof import("../components/competitions/AdminCompetitionList.vue")['default']
export const CompetitionsCompetitionForm: typeof import("../components/competitions/CompetitionForm.vue")['default']
export const ContactAdminContactList: typeof import("../components/contact/AdminContactList.vue")['default']
export const ContactForm: typeof import("../components/contact/ContactForm.vue")['default']
export const HorsesAdminHorseList: typeof import("../components/horses/AdminHorseList.vue")['default']
export const HorsesAdminRacehorseList: typeof import("../components/horses/AdminRacehorseList.vue")['default']
export const HorsesHorseCard: typeof import("../components/horses/HorseCard.vue")['default']
export const HorsesHorseFilter: typeof import("../components/horses/HorseFilter.vue")['default']
export const HorsesHorseForm: typeof import("../components/horses/HorseForm.vue")['default']
export const HorsesHorseGallery: typeof import("../components/horses/HorseGallery.vue")['default']
export const HorsesHorseImageGallery: typeof import("../components/horses/HorseImageGallery.vue")['default']
export const HorsesHorseImageUpload: typeof import("../components/horses/HorseImageUpload.vue")['default']
export const HorsesPedigreeTree: typeof import("../components/horses/PedigreeTree.vue")['default']
export const IconsIconCommunity: typeof import("../components/icons/IconCommunity.vue")['default']
export const IconsIconDocumentation: typeof import("../components/icons/IconDocumentation.vue")['default']
export const IconsIconEcosystem: typeof import("../components/icons/IconEcosystem.vue")['default']
export const IconsIconSupport: typeof import("../components/icons/IconSupport.vue")['default']
export const IconsIconTooling: typeof import("../components/icons/IconTooling.vue")['default']
export const OrdersAdminOrderList: typeof import("../components/orders/AdminOrderList.vue")['default']
export const OrdersOrderLookup: typeof import("../components/orders/OrderLookup.vue")['default']
export const OrdersOrderStatusBadge: typeof import("../components/orders/OrderStatusBadge.vue")['default']
export const PagesHorsesPage: typeof import("../components/pages/HorsesPage.vue")['default']
export const PagesResultsPage: typeof import("../components/pages/ResultsPage.vue")['default']
export const PagesRolunkPage: typeof import("../components/pages/RolunkPage.vue")['default']
export const ProductsAdminCategoryList: typeof import("../components/products/AdminCategoryList.vue")['default']
export const ProductsAdminProductList: typeof import("../components/products/AdminProductList.vue")['default']
export const ProductsCategoryForm: typeof import("../components/products/CategoryForm.vue")['default']
export const ProductsProductForm: typeof import("../components/products/ProductForm.vue")['default']
export const WebshopCartIcon: typeof import("../components/webshop/CartIcon.vue")['default']
export const WebshopPaginationBar: typeof import("../components/webshop/PaginationBar.vue")['default']
export const WebshopPriceRangeSlider: typeof import("../components/webshop/PriceRangeSlider.vue")['default']
export const WebshopProductCard: typeof import("../components/webshop/ProductCard.vue")['default']
export const WebshopProductFilter: typeof import("../components/webshop/ProductFilter.vue")['default']
export const NuxtWelcome: typeof import("../node_modules/nuxt/dist/app/components/welcome.vue")['default']
export const NuxtLayout: typeof import("../node_modules/nuxt/dist/app/components/nuxt-layout")['default']
export const NuxtErrorBoundary: typeof import("../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']
export const ClientOnly: typeof import("../node_modules/nuxt/dist/app/components/client-only")['default']
export const DevOnly: typeof import("../node_modules/nuxt/dist/app/components/dev-only")['default']
export const ServerPlaceholder: typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']
export const NuxtLink: typeof import("../node_modules/nuxt/dist/app/components/nuxt-link")['default']
export const NuxtLoadingIndicator: typeof import("../node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']
export const NuxtTime: typeof import("../node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']
export const NuxtRouteAnnouncer: typeof import("../node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']
export const NuxtImg: typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']
export const NuxtPicture: typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']
export const NuxtPage: typeof import("../node_modules/nuxt/dist/pages/runtime/page")['default']
export const NoScript: typeof import("../node_modules/nuxt/dist/head/runtime/components")['NoScript']
export const Link: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Link']
export const Base: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Base']
export const Title: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Title']
export const Meta: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Meta']
export const Style: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Style']
export const Head: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Head']
export const Html: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Html']
export const Body: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Body']
export const NuxtIsland: typeof import("../node_modules/nuxt/dist/app/components/nuxt-island")['default']
export const LazyErrorAlert: LazyComponent<typeof import("../components/ErrorAlert.vue")['default']>
export const LazyFooter: LazyComponent<typeof import("../components/Footer.vue")['default']>
export const LazyHeader: LazyComponent<typeof import("../components/Header.vue")['default']>
export const LazyLoadingSpinner: LazyComponent<typeof import("../components/LoadingSpinner.vue")['default']>
export const LazySkeletonImage: LazyComponent<typeof import("../components/SkeletonImage.vue")['default']>
export const LazyAdminDashboard: LazyComponent<typeof import("../components/admin/AdminDashboard.vue")['default']>
export const LazyAdminLayout: LazyComponent<typeof import("../components/admin/AdminLayout.vue")['default']>
export const LazyAdminLoginPage: LazyComponent<typeof import("../components/admin/LoginPage.vue")['default']>
export const LazyCompetitionsAdminCompetitionList: LazyComponent<typeof import("../components/competitions/AdminCompetitionList.vue")['default']>
export const LazyCompetitionsCompetitionForm: LazyComponent<typeof import("../components/competitions/CompetitionForm.vue")['default']>
export const LazyContactAdminContactList: LazyComponent<typeof import("../components/contact/AdminContactList.vue")['default']>
export const LazyContactForm: LazyComponent<typeof import("../components/contact/ContactForm.vue")['default']>
export const LazyHorsesAdminHorseList: LazyComponent<typeof import("../components/horses/AdminHorseList.vue")['default']>
export const LazyHorsesAdminRacehorseList: LazyComponent<typeof import("../components/horses/AdminRacehorseList.vue")['default']>
export const LazyHorsesHorseCard: LazyComponent<typeof import("../components/horses/HorseCard.vue")['default']>
export const LazyHorsesHorseFilter: LazyComponent<typeof import("../components/horses/HorseFilter.vue")['default']>
export const LazyHorsesHorseForm: LazyComponent<typeof import("../components/horses/HorseForm.vue")['default']>
export const LazyHorsesHorseGallery: LazyComponent<typeof import("../components/horses/HorseGallery.vue")['default']>
export const LazyHorsesHorseImageGallery: LazyComponent<typeof import("../components/horses/HorseImageGallery.vue")['default']>
export const LazyHorsesHorseImageUpload: LazyComponent<typeof import("../components/horses/HorseImageUpload.vue")['default']>
export const LazyHorsesPedigreeTree: LazyComponent<typeof import("../components/horses/PedigreeTree.vue")['default']>
export const LazyIconsIconCommunity: LazyComponent<typeof import("../components/icons/IconCommunity.vue")['default']>
export const LazyIconsIconDocumentation: LazyComponent<typeof import("../components/icons/IconDocumentation.vue")['default']>
export const LazyIconsIconEcosystem: LazyComponent<typeof import("../components/icons/IconEcosystem.vue")['default']>
export const LazyIconsIconSupport: LazyComponent<typeof import("../components/icons/IconSupport.vue")['default']>
export const LazyIconsIconTooling: LazyComponent<typeof import("../components/icons/IconTooling.vue")['default']>
export const LazyOrdersAdminOrderList: LazyComponent<typeof import("../components/orders/AdminOrderList.vue")['default']>
export const LazyOrdersOrderLookup: LazyComponent<typeof import("../components/orders/OrderLookup.vue")['default']>
export const LazyOrdersOrderStatusBadge: LazyComponent<typeof import("../components/orders/OrderStatusBadge.vue")['default']>
export const LazyPagesHorsesPage: LazyComponent<typeof import("../components/pages/HorsesPage.vue")['default']>
export const LazyPagesResultsPage: LazyComponent<typeof import("../components/pages/ResultsPage.vue")['default']>
export const LazyPagesRolunkPage: LazyComponent<typeof import("../components/pages/RolunkPage.vue")['default']>
export const LazyProductsAdminCategoryList: LazyComponent<typeof import("../components/products/AdminCategoryList.vue")['default']>
export const LazyProductsAdminProductList: LazyComponent<typeof import("../components/products/AdminProductList.vue")['default']>
export const LazyProductsCategoryForm: LazyComponent<typeof import("../components/products/CategoryForm.vue")['default']>
export const LazyProductsProductForm: LazyComponent<typeof import("../components/products/ProductForm.vue")['default']>
export const LazyWebshopCartIcon: LazyComponent<typeof import("../components/webshop/CartIcon.vue")['default']>
export const LazyWebshopPaginationBar: LazyComponent<typeof import("../components/webshop/PaginationBar.vue")['default']>
export const LazyWebshopPriceRangeSlider: LazyComponent<typeof import("../components/webshop/PriceRangeSlider.vue")['default']>
export const LazyWebshopProductCard: LazyComponent<typeof import("../components/webshop/ProductCard.vue")['default']>
export const LazyWebshopProductFilter: LazyComponent<typeof import("../components/webshop/ProductFilter.vue")['default']>
export const LazyNuxtWelcome: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/welcome.vue")['default']>
export const LazyNuxtLayout: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-layout")['default']>
export const LazyNuxtErrorBoundary: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']>
export const LazyClientOnly: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/client-only")['default']>
export const LazyDevOnly: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/dev-only")['default']>
export const LazyServerPlaceholder: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']>
export const LazyNuxtLink: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-link")['default']>
export const LazyNuxtLoadingIndicator: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']>
export const LazyNuxtTime: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']>
export const LazyNuxtRouteAnnouncer: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']>
export const LazyNuxtImg: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']>
export const LazyNuxtPicture: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']>
export const LazyNuxtPage: LazyComponent<typeof import("../node_modules/nuxt/dist/pages/runtime/page")['default']>
export const LazyNoScript: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['NoScript']>
export const LazyLink: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Link']>
export const LazyBase: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Base']>
export const LazyTitle: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Title']>
export const LazyMeta: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Meta']>
export const LazyStyle: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Style']>
export const LazyHead: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Head']>
export const LazyHtml: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Html']>
export const LazyBody: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Body']>
export const LazyNuxtIsland: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-island")['default']>

export const componentNames: string[]
