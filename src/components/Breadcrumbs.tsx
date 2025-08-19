// 'use client';

// import Link from 'next/link';
// import Script from 'next/script';

// type Crumb = { name: string; href: string };

// export default function Breadcrumbs({ items }: { items: Crumb[] }) {
//   const base = process.env.NEXT_PUBLIC_SITE_URL || '';
//   const jsonLd = {
//     '@context': 'https://schema.org',
//     '@type': 'BreadcrumbList',
//     itemListElement: items.map((it, i) => ({
//       '@type': 'ListItem',
//       position: i + 1,
//       name: it.name,
//       item: it.href.startsWith('http') ? it.href : `${base}${it.href}`,
//     })),
//   };

//   return (
//     <nav aria-label="Breadcrumb" className="mb-4 text-sm">
//       <ol className="flex flex-wrap items-center gap-2">
//         {items.map((it, i) => (
//           <li key={`${it.href}-${i}`} className="flex items-center gap-2">
//             <Link href={it.href} className="text-gray-600 hover:text-gray-900">
//               {it.name}
//             </Link>
//             {i < items.length - 1 ? <span className="text-gray-400">/</span> : null}
//           </li>
//         ))}
//       </ol>
//       <Script id="breadcrumb-jsonld" type="application/ld+json"
//         dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
//     </nav>
//   );
// }

'use client';

import Link from 'next/link';
import Script from 'next/script';
import { useId } from 'react';

type Crumb = { name: string; href: string };

export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  const base = process.env.NEXT_PUBLIC_SITE_URL || '';
  const scriptId = `breadcrumb-jsonld-${useId()}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: it.href.startsWith('http') ? it.href : `${base}${it.href}`,
    })),
  };

  return (
    <nav aria-label="Breadcrumb" className="mb-4 text-sm">
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((it, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={`${it.href}-${i}`} className="flex items-center gap-2">
              {isLast ? (
                <span className="text-gray-900 font-semibold" aria-current="page">
                  {it.name}
                </span>
              ) : (
                <Link href={it.href} className="text-gray-600 hover:text-gray-900">
                  {it.name}
                </Link>
              )}
              {!isLast ? <span className="text-gray-400">/</span> : null}
            </li>
          );
        })}
      </ol>

      {/* JSON-LD */}
      <Script
        id={scriptId}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </nav>
  );
}
