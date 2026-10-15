# Tableau

Composants composables avec les balises HTML natives, des slots et des classes Tailwind personnalisables via `class`.

```vue
<script setup lang="ts">
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from "~/components/ui/table";
</script>

<template>
  <Table container-class="rounded-lg border">
    <TableCaption>Liste des animaux</TableCaption>
    <TableHeader>
      <TableRow>
        <TableHead>Nom</TableHead>
        <TableHead class="text-right">Espèce</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow>
        <TableCell>Milo</TableCell>
        <TableCell class="text-right">Chat</TableCell>
      </TableRow>
    </TableBody>
  </Table>
</template>
```

`Table` gère le défilement horizontal. `container-class` personnalise son conteneur ; `class` et les autres attributs sont transmis à la balise `<table>`.

Les attributs natifs (`colspan`, `scope`, `aria-*`, etc.) et les événements sont transmis aux éléments correspondants. `TableHead` utilise `scope="col"` par défaut, surchargeable pour les en-têtes de ligne. `TableFooter` permet d’ajouter un pied de tableau. Les lignes acceptent `data-state="selected"` pour afficher un état sélectionné.
