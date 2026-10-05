<script setup lang="ts">
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Label, PasswordInput } from "~/components/ui/Form";
import { deleteAccount } from "~/lib/auth-client";
import { toast } from "vue-sonner";
import { Spinner } from "~/components/ui/spinner";

const password = ref("");
const loading = ref(false);

const handleDeleteAccount = async () => {
  if (!password.value || loading.value) {
    return;
  }
  loading.value = true;
  try {
    const { error } = await deleteAccount(password.value);
    if (error) {
      throw new Error(error.message);
    } else {
      toast.success("Compte supprimé avec succès");
    }
    navigateTo("/inscription");
  } catch (error) {
    console.error(
      `Error deleting account: ${error instanceof Error ? error.message : String(error)}`,
    );
    toast.error("Erreur lors de la suppression du compte");
  } finally {
    loading.value = false;
  }
};

const resetPassword = () => {
  password.value = "";
};
</script>

<template>
  <Dialog @update:open="resetPassword">
    <DialogTrigger as-child>
      <Button variant="destructive" size="lg"> Supprimer mon compte </Button>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Supprimer mon compte</DialogTitle>
        <DialogDescription>
          Êtes-vous sûr de vouloir supprimer votre compte ? Votre compte et les
          animaux dont vous êtes le seul propriétaire seront définitivement
          supprimés. Les animaux partagés seront conservés et resteront
          accessibles aux autres propriétaires. Si nécessaire, leur créateur
          sera transféré à un autre propriétaire. Cette action est irréversible.
        </DialogDescription>
      </DialogHeader>
      <form action="" class="space-y-4" @submit.prevent="handleDeleteAccount">
        <Label for="password" class="block mb-2 mt-4 text-start">
          Confirmez avec votre mot de passe
        </Label>
        <PasswordInput
          v-model="password"
          placeholder="Entrez votre mot de passe"
          required
        />

        <DialogFooter class="flex lg:flex-row gap-2 mt-4">
          <DialogClose as-child>
            <Button type="button" variant="outline"> Annuler </Button>
          </DialogClose>
          <Button type="submit" variant="destructive" :disabled="loading">
            <Spinner v-if="loading" class="w-4 h-4 mr-2" />
            <span v-if="!loading">Supprimer mon compte</span>
            <span v-else>Suppression en cours...</span>
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
