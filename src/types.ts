export interface Product {
  id: string | number
  name: string
  description: string
  price: number
  image_url: string
  category: string
  created_at?: string
  tags?: string[]
  is_featured?: boolean
}
