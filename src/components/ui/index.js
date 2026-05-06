/**
 * Barrel export — semua komponen UI SMK Binatama
 * Import mudah: import { Button, Card, Badge } from '../components/ui'
 */

// Button
export { default as Button }     from './Button'
export { IconButton }            from './Button'

// Card
export { default as Card }       from './Card'
export { MetricCard }            from './Card'
export { ActionCard }            from './Card'

// Badge
export { default as Badge }      from './Badge'
export { StatusBadge }           from './Badge'
export { RoleBadge }             from './Badge'

// Input
export { default as Input }      from './Input'
export { Select }                from './Input'
export { Textarea }              from './Input'

// Modal
export { default as Modal }      from './Modal'
export { ConfirmDialog }         from './Modal'

// Toast
export { default as ToastContainer } from './Toast'
export { useToast }              from './Toast'

// SearchBar
export { default as SearchBar }  from './SearchBar'
export { FilterBar }             from './SearchBar'

// Table
export { default as Table }      from './Table'
export { Pagination }            from './Table'

// StatBanner
export { default as StatBanner } from './Startbanner'

// Misc
export {
  PageHeader,
  SectionHeader,
  LoadingSpinner,
  LoadingSkeleton,
  EmptyState,
  Avatar,
  ListItem,
  Divider,
  InfoRow,
}                                from './Misc'

// ProtectedRoute
export { default as ProtectedRoute } from './ProtectedRoute'