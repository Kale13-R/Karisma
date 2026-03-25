/**
 * Color variant configuration for products that share the same base item
 * but come in different colors. Each group maps a display color name
 * to the product ID and a CSS-friendly hex value for the swatch.
 */

export interface ColorVariant {
  productId: string
  colorName: string
  hex: string
}

export interface VariantGroup {
  displayName: string
  variants: ColorVariant[]
}

/** All variant groups keyed by a group slug */
const VARIANT_GROUPS: VariantGroup[] = [
  {
    displayName: 'KARISMA DROP 1',
    variants: [
      { productId: 'new-black-tee', colorName: 'Black', hex: '#111111' },
      { productId: 'new-red-tee', colorName: 'Red', hex: '#C41E1E' },
    ],
  },
]

/**
 * Given a product ID, find its variant group and return the sibling variants.
 * Returns null if the product has no color variants.
 */
export function getColorVariants(productId: string): VariantGroup | null {
  for (const group of VARIANT_GROUPS) {
    if (group.variants.some((v) => v.productId === productId)) {
      return group
    }
  }
  return null
}
