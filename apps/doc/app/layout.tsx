import { Footer, Layout, Navbar } from 'nextra-theme-docs'
import { Head } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import 'nextra-theme-docs/style.css'
import type { ReactNode } from 'react'

export const metadata = {
  metadataBase: new URL('https://micmc422.github.io/TP-Nextjs-tw3'),
  title: {
    template: '%s - Documentation TP Next.js',
    default: 'Documentation TP Next.js'
  },
  description: 'Documentation complète du projet TP Next.js avec Turborepo',
  applicationName: 'TP Next.js Documentation',
  generator: 'Next.js',
  appleWebApp: {
    title: 'TP Next.js Docs'
  },
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>📚</text></svg>'
  }
}

const logo = (
  <span style={{ fontWeight: 'bold' }}>
    📚 TP Next.js - Documentation
  </span>
)

export default async function RootLayout({ children }: { children: ReactNode }) {
  const navbar = (
    <Navbar
      logo={logo}
      projectLink="https://github.com/micmc422/TP-Nextjs-tw3"
    />
  )

  const footer = (
    <Footer>
      TP Next.js Avancé - {new Date().getFullYear()} © Documentation
    </Footer>
  )

  const pageMap = await getPageMap()

  return (
    <html lang="fr" dir="ltr" suppressHydrationWarning>
      <Head faviconGlyph="📚" />
      <body>
        <Layout
          navbar={navbar}
          footer={footer}
          editLink="Modifier cette page sur GitHub →"
          docsRepositoryBase="https://github.com/micmc422/TP-Nextjs-tw3/tree/master/apps/doc"
          sidebar={{
            defaultMenuCollapseLevel: 1,
            toggleButton: true
          }}
          toc={{
            backToTop: true,
            title: 'Sur cette page'
          }}
          feedback={{
            content: 'Des questions ? Donnez-nous votre avis →',
            labels: 'feedback'
          }}
          pageMap={pageMap}
        >
          {children}
        </Layout>
      </body>
    </html>
  )
}
