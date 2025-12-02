"use client";

import Image, { ImageProps } from "next/image";
import { useState, useEffect } from "react";
import { ImageOff } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";

interface PokemonImageProps extends Omit<ImageProps, "src"> {
  src?: string | null;
}

export function PokemonImage({ src, alt, className, ...props }: PokemonImageProps) {
  const [error, setError] = useState(false);

  useEffect(() => {
    setError(false);
  }, [src]);

  if (error || !src) {
    return (
      <div className={cn("flex items-center justify-center bg-muted/20 rounded-md", className)}>
        <ImageOff className="text-muted-foreground/40 object-cover" />
        <span className="sr-only">Image non disponible pour {alt}</span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
      {...props}
    />
  );
}
