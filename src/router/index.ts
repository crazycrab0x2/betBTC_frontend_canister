import { createRouter, createWebHistory } from 'vue-router'
import LandingView from '../views/LandingView.vue'
import ReferralView from '../views/ReferralView.vue'
import ProfileView from '../views/ProfileView.vue'
import WalletView from '../views/WalletView.vue'
import WatchlistView from '../views/WatchlistView.vue'
import ActivityView from '../views/ActivityView.vue'
import MarketView from '../views/MarketView.vue'
import PartnershipsView from '@/views/PartnershipsView.vue'
import AdminView from '@/views/AdminView.vue'
import Page404View from '@/views/Page404View.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'landing',
      component: LandingView
    },
    {
      path: '/partnerships',
      name: 'partnerships',
      component: PartnershipsView
    },
    {
      path: '/watchlist',
      name: 'watchlist',
      component: WatchlistView
    },
    {
      path: '/activity',
      name: 'activity',
      component: ActivityView
    },
    {
      path: '/leaderboard',
      name: 'referrals',
      component: ReferralView
    },
    {
      path: '/wallet',
      name: 'wallet',
      component: WalletView
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView
    },
    {
      path: '/market/:id?',
      name: 'market',
      component: MarketView
    },
    {
      path: '/admin',
      name: 'admin',
      component: AdminView
    },
    {
      path: '/:pathMatch(.*)*',
      name: '404 page',
      component: Page404View
    }
  ]
})

export default router
