"use client";

import Link from "next/link";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { User, Mail, Save, X } from "lucide-react";
import { updateUserAction } from "../actions";

interface UserData {
  _id: string;
  email: string;
  name: string;
}

interface UserEditFormProps {
  user: UserData;
}

export function UserEditForm({ user }: UserEditFormProps) {
  return (
    <form action={updateUserAction} className="space-y-4">
      <input type="hidden" name="id" value={user._id} />
      
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium flex items-center gap-2">
          <User className="h-4 w-4 text-muted-foreground" />
          Nom
        </label>
        <Input
          id="name"
          name="name"
          type="text"
          defaultValue={user.name}
          required
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
          <Mail className="h-4 w-4 text-muted-foreground" />
          Email
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          defaultValue={user.email}
          required
        />
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button type="submit" className="flex-1">
          <Save className="mr-2 h-4 w-4" />
          Enregistrer
        </Button>
        <Button type="button" variant="outline" className="flex-1" asChild>
          <Link href={`/utilisateur/${user._id}`}>
            <X className="mr-2 h-4 w-4" />
            Annuler
          </Link>
        </Button>
      </div>
    </form>
  );
}
