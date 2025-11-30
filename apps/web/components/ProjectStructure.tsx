// components/ProjectStructure.tsx
import React from 'react';
import { cn } from '@workspace/ui/lib/utils';
import { Folder, FileText, Code } from 'lucide-react'; // Icônes de lucide-react (standard de shadcn/ui)

/**
 * Type pour un élément dans la structure de projet.
 * Le 'name' peut être un fichier ou un dossier.
 * 'children' est optionnel et définit le contenu du dossier.
 */
type ProjectItem = {
    name: string;
    type: 'folder' | 'file';
    children?: ProjectItem[];
};

interface ProjectStructureProps {
    /**
     * Le tableau d'éléments qui définissent la hiérarchie.
     */
    structure?: ProjectItem[];
    /**
     * Titre optionnel à afficher au-dessus de la structure.
     */
    title?: string;
    /**
     * Classes personnalisées pour le conteneur principal.
     */
    className?: string;
}

// 1. Définition de la structure de données
const defaultData: ProjectItem[] = [
    {
        name: 'TP-Nextjs-tw3',
        type: 'folder',
        children: [
            {
                name: 'apps',
                type: 'folder',
                children: [
                    {
                        name: 'web',
                        type: 'folder',
                        children: [
                            { name: 'components', type: 'folder' },
                            { name: 'app', type: 'folder' },
                            { name: 'package.json', type: 'file' },
                        ],
                    },
                ],
            },
            {
                name: 'packages',
                type: 'folder',
                children: [
                    {
                        name: 'ui',
                        type: 'folder',
                        children: [
                            { name: 'components', type: 'folder' },
                            { name: 'lib', type: 'folder' },
                            { name: 'package.json', type: 'file' },
                        ],
                    },
                ],
            },
            { name: 'package.json', type: 'file' },
            { name: 'turbo.json', type: 'file' },
            { name: 'pnpm-workspace.yaml', type: 'file' },
        ],
    },
];
/**
 * Composant récursif pour afficher un seul élément de la structure.
 */
const StructureItem: React.FC<{ item: ProjectItem; depth: number }> = ({ item, depth }) => {
    const isFolder = item.type === 'folder';

    // Définit l'icône en fonction du type
    const Icon = isFolder ? Folder :
        item.name.endsWith('.tsx') || item.name.endsWith('.ts') || item.name.endsWith('.js') || item.name.endsWith('.json')
            ? Code // Utilise l'icône Code pour les fichiers de programmation
            : FileText; // Icône de fichier texte par défaut

    return (
        <div className="flex flex-col">
            {/* Ligne de l'élément (dossier ou fichier) */}
            <div
                className={cn(
                    "flex items-center space-x-2 py-0.5 pl-2",
                    // Ajuste la marge gauche en fonction de la profondeur pour l'indentation
                    depth > 0 && `ml-${depth * 4}`,
                    isFolder ? 'font-semibold text-gray-800 dark:text-gray-200' : 'text-gray-600 dark:text-gray-400'
                )}
            >
                <Icon className={cn("w-4 h-4 shrink-0", isFolder ? 'text-yellow-500' : 'text-blue-400')} />
                <span className="font-mono text-sm">{item.name}</span>
            </div>

            {/* Rendu récursif des enfants si c'est un dossier */}
            {isFolder && item.children && item.children.length > 0 && (
                <div className="border-l border-gray-300 dark:border-gray-700 ml-4">
                    {/* La bordure simule la ligne verticale d'indentation */}
                    {item.children.map((child, index) => (
                        <StructureItem key={index} item={child} depth={depth + 1} />
                    ))}
                </div>
            )}
        </div>
    );
};

/**
 * Composant principal pour afficher la structure complète du projet.
 */
export function ProjectStructure({ structure = defaultData, title, className }: ProjectStructureProps) {
    return (
        <div
            className={cn(
                "bg-gray-50 dark:bg-gray-900 p-4 border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm font-mono",
                className
            )}
        >
            {/* Titre optionnel */}
            {title && (
                <p className="text-lg font-bold mb-3 text-gray-900 dark:text-gray-100 border-b pb-2">
                    {title}
                </p>
            )}

            {/* Rendu des éléments de la structure */}
            <div className="space-y-0.5">
                {structure.map((item, index) => (
                    <StructureItem key={index} item={item} depth={0} />
                ))}
            </div>
        </div>
    );
}