const CATEGORY_IMAGES: Record<string, string> = {
  '🥩 정육':    'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&q=80&w=600',
  '🥬 채소':    'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=600',
  '🐟 수산':    'https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?auto=format&fit=crop&q=80&w=600',
  '🍱 반찬':    'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&q=80&w=600',
  '🥐 베이커리': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=600',
};

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1607532941433-304659e8198a?auto=format&fit=crop&q=80&w=600';

export function getCategoryImage(category: string, imageUrl?: string | null, size?: 'thumb' | 'medium'): string {
  if (imageUrl) {
    if (size) return imageUrl.replace(/\/products\/(?!thumb\/|medium\/)/, `/products/${size}/`);
    return imageUrl;
  }
  return CATEGORY_IMAGES[category] ?? DEFAULT_IMAGE;
}
