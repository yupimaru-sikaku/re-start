import { BreadcrumbItem } from '@/components/Common/CustomBreadcrumbs';

export function getBreadcrumbs(path: string): BreadcrumbItem[] {
  const pathParts = path.split('/').filter((part) => part !== '');

  const items: BreadcrumbItem[] = [
    { label: 'Home', href: '/' }, // デフォルトのホーム
  ];
  // 他のルートのパンくずアイテムを追加
  pathParts.map((part) => {
    const basePath = items[items.length - 1].href || '/';
    const newPath = basePath + part + '/';
    // 例: /blog/[slug]などのルートのパンくずアイテムを追加
    if (part === 'user') {
      items.push({ label: '利用者一覧', href: newPath });
    } else if (part === 'register') {
      items.push({ label: '利用者登録', href: newPath });
    } else if (part === 'home-care') {
      items.push({ label: '居宅介護一覧', href: newPath });
    } else if (part === 'accompany') {
      items.push({ label: '同行援護一覧', href: newPath });
    } else if (part === 'create') {
      items.push({ label: '実績記録票作成', href: newPath });
    } else if (part === 'edit') {
      items.push({ label: '実績記録票編集', href: undefined });
    }
  });

  return items;
}
