/**
 * Proxy Next.js 16 - Protection des routes
 * 
 * Ce proxy intercepte les requêtes et effectue une vérification légère
 * d'authentification pour les routes protégées (pages utilisateur).
 * 
 * Concepts clés pour les étudiants :
 * - Proxy Next.js 16 pour la protection des routes (remplace middleware)
 * - Vérification légère de la présence du token
 * - Redirection vers la page de connexion
 * - La validation complète du JWT doit se faire au niveau des Server Components
 */

import { NextResponse, NextRequest } from "next/server";

/**
 * Routes protégées nécessitant une authentification
 */
const protectedRoutes = ["/utilisateur"];

/**
 * Routes publiques (accessibles sans authentification)
 */
const publicRoutes = ["/connexion", "/inscription"];

/**
 * Proxy exécuté à chaque requête
 * 
 * Note Next.js 16 : Le proxy doit rester léger et ne pas contenir
 * de logique d'authentification complexe. La validation complète
 * du JWT doit être effectuée au niveau du Server Component ou DAL.
 * 
 * @param request - Requête Next.js
 * @returns Réponse ou redirection
 */
export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const sessionCookie = request.cookies.get("session")?.value;
  
  // Vérifie si la route est protégée
  const isProtectedRoute = protectedRoutes.some((route) => path.startsWith(route));
  const isPublicRoute = publicRoutes.some((route) => path === route);
  
  // Si route protégée et pas de session, rediriger vers connexion
  if (isProtectedRoute && !sessionCookie) {
    return NextResponse.redirect(new URL("/connexion", request.url));
  }
  
  // Si utilisateur avec session sur une route publique, rediriger vers utilisateur
  if (isPublicRoute && sessionCookie) {
    return NextResponse.redirect(new URL("/utilisateur", request.url));
  }
  
  return NextResponse.next();
}

/**
 * Configuration du matcher pour le proxy
 * Exclut les fichiers statiques et les routes API internes de Next.js
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
