 # Portfolio de Yesse Boukinda

 Portfolio personnel de Yesse Boukinda, DevOps.

 ## Lancer le projet

 Installer les dépendances :

 ```bash
 npm install
 ```

 Lancer le serveur de développement :

 ```bash
 npm run dev
 ```

 Le portfolio présente les projets professionnels de Yesse Boukinda.

 ## Auteur

 Conception et maintenance par Yesse Boukinda.

 ## Espace administrateur

 L'administration utilise Supabase pour l'authentification, les contenus et les images.

 1. Crée un projet Supabase et copie `.env.example` vers `.env.local`.
 2. Renseigne `NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_ANON_KEY` depuis les paramètres API du projet.
 3. Exécute [`supabase/schema.sql`](./supabase/schema.sql) dans l'éditeur SQL Supabase.
 4. Dans Supabase Authentication, crée le compte admin et désactive les inscriptions publiques.
 5. Ajoute l'UUID de ce compte dans `public.portfolio_admins` :

    ```sql
    insert into public.portfolio_admins (user_id)
    values ('UUID_DU_COMPTE_ADMIN');
    ```

 6. Ajoute les deux mêmes variables d'environnement dans les paramètres de déploiement Vercel, puis redéploie.
 7. Ouvre `/admin` sur le site et connecte-toi avec le compte créé.

 Les modifications du site doivent être enregistrées depuis le tableau de bord. Les images JPG, PNG et WebP jusqu'à 5 Mo, ainsi que les vidéos MP4, WebM et OGG jusqu'à 50 Mo, sont stockées dans le bucket Supabase `portfolio-media`. Après toute modification du schéma, réexécute `supabase/schema.sql` dans l'éditeur SQL Supabase.

