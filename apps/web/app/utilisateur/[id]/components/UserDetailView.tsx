import Link from "next/link";
import { Button } from "@workspace/ui/components/button";
import { Text } from "@/components/Text";
import { Mail, Calendar, Edit, Trash2 } from "lucide-react";
import { deleteUserAction } from "../actions";

interface UserData {
  _id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

interface UserDetailViewProps {
  user: UserData;
}

export function UserDetailView({ user }: UserDetailViewProps) {
  return (
    <>
      {/* Email */}
      <div className="flex items-start gap-4">
        <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
        <div>
          <Text className="font-medium">Email</Text>
          <Text className="text-muted-foreground">{user.email}</Text>
        </div>
      </div>

      {/* Date de création */}
      <div className="flex items-start gap-4">
        <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
        <div>
          <Text className="font-medium">Date de création</Text>
          <Text className="text-muted-foreground">
            {new Date(user.createdAt).toLocaleDateString("fr-FR", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </div>
      </div>

      {/* Date de mise à jour */}
      <div className="flex items-start gap-4">
        <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
        <div>
          <Text className="font-medium">Dernière mise à jour</Text>
          <Text className="text-muted-foreground">
            {new Date(user.updatedAt).toLocaleDateString("fr-FR", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t mt-6">
        <Button className="flex-1" asChild>
          <Link href={`/utilisateur/${user._id}?edit=true`}>
            <Edit className="mr-2 h-4 w-4" />
            Modifier
          </Link>
        </Button>
        
        <form action={deleteUserAction} className="flex-1">
          <input type="hidden" name="id" value={user._id} />
          <Button variant="destructive" type="submit" className="w-full">
            <Trash2 className="mr-2 h-4 w-4" />
            Supprimer
          </Button>
        </form>
      </div>
    </>
  );
}
