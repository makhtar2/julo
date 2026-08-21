# Tests manuels a faire - Global Air

Ce fichier liste les tests a faire dans le navigateur avant de considerer le site pret pour mise en ligne.

## 1. Pages publiques

- Ouvrir la page d'accueil `/` et verifier que les produits, bannieres et liens s'affichent.
- Ouvrir `/shop` et verifier la liste des produits.
- Tester la recherche produit si elle est presente dans l'interface.
- Tester le filtre par categorie.
- Ouvrir une fiche produit et verifier les images, prix, stock, description et produits similaires.
- Ouvrir `/blog` puis un article de blog.
- Ouvrir `/about`, `/contact`, `/privacy`, `/terms` et `/cookies`.
- Verifier que le bouton WhatsApp ouvre bien WhatsApp avec le bon numero.

## 2. Compte client

- Creer un nouveau compte client depuis `/login`.
- Se connecter avec ce compte.
- Se deconnecter.
- Se reconnecter avec le meme compte.
- Tester un mauvais mot de passe et verifier que le message d'erreur est clair.
- Verifier que `/orders` et `/profile` redirigent vers `/login` quand l'utilisateur n'est pas connecte.
- Verifier que `/orders` et `/profile` s'ouvrent quand l'utilisateur est connecte.
- Tester Google/Facebook seulement si ces providers sont configures dans Supabase.

## 3. Panier et favoris

- Ajouter un produit au panier depuis la liste produits.
- Ajouter un produit au panier depuis une fiche produit.
- Modifier la quantite dans le panier.
- Supprimer un produit du panier.
- Verifier que le total change correctement.
- Ajouter puis retirer un produit des favoris.
- Recharger la page et verifier que panier/favoris restent presents.

## 4. Commande client

- Ajouter un produit disponible au panier.
- Aller sur `/cart`.
- Ajouter une adresse de livraison complete.
- Passer une commande avec paiement WhatsApp.
- Verifier que la commande est creee.
- Verifier que WhatsApp s'ouvre avec le message de commande.
- Verifier que le panier est vide apres commande.
- Verifier que la commande apparait dans `/orders`.
- Passer une commande avec paiement Cash.
- Tester le retrait en magasin.
- Tester une commande avec un stock insuffisant.
- Verifier que Wave est affiche comme non disponible.
- Verifier que Orange Money est affiche comme non disponible.
- Verifier qu'on ne peut pas selectionner Wave ou Orange Money.

## 5. Emails

- Apres une commande, verifier que l'email de confirmation est recu.
- Verifier le contenu de l'email: numero de commande, total, articles.
- Si la fonction stock est active, tester une notification de retour en stock.
- Verifier les erreurs dans les logs si aucun email n'arrive.

## 6. Administration

- Se connecter avec un compte admin.
- Verifier que l'admin est accessible via `/admin`.
- Verifier qu'un compte client non-admin est renvoye vers l'accueil s'il tente `/admin`.
- Ouvrir le dashboard admin.
- Verifier les statistiques: produits, commandes, revenus, clients.
- Ouvrir `/admin/products`.
- Ajouter un produit avec image, prix, stock et categorie.
- Modifier un produit.
- Changer le stock d'un produit.
- Supprimer un produit de test.
- Ouvrir `/admin/categories`.
- Ajouter une categorie.
- Supprimer une categorie de test.
- Ouvrir `/admin/orders`.
- Voir le detail d'une commande.
- Changer le statut d'une commande.
- Tester le bouton de validation WhatsApp d'une commande.
- Ouvrir `/admin/banners`.
- Ajouter, modifier et supprimer une banniere de test.
- Ouvrir `/admin/blog`.
- Ajouter, modifier et supprimer un article de test.
- Ouvrir `/admin/analytics` et verifier que les graphiques se chargent.

## 7. Uploads et images

- Tester l'upload d'image produit.
- Tester l'upload d'image blog.
- Tester l'upload d'image banniere.
- Tester une image trop lourde.
- Tester un fichier non-image.
- Verifier que les images Cloudinary s'affichent sur le site public.

## 8. Mobile et responsive

- Tester l'accueil sur mobile.
- Tester la boutique sur mobile.
- Tester la fiche produit sur mobile.
- Tester le panier et le formulaire d'adresse sur mobile.
- Tester `/orders` sur mobile.
- Tester la navigation basse mobile.
- Tester l'admin sur mobile, surtout produits et commandes.
- Verifier qu'aucun texte ne deborde des boutons ou cartes.

## 9. Securite et acces

- Verifier que le lien admin n'est pas visible publiquement pour un client normal.
- Verifier que `/admin` redirige vers `/login` sans session.
- Verifier qu'un client connecte mais non-admin ne peut pas ouvrir `/admin`.
- Verifier que les actions admin echouent avec un compte non-admin.
- Verifier que les pages publiques ne montrent pas d'erreurs sensibles.

## 10. Verification technique avant mise en ligne

- Lancer `npm run lint`.
- Lancer `npm run test:run`.
- Lancer `npm run build`.
- Ouvrir `/api/health` et verifier que la base est connectee.
- Verifier les variables d'environnement de production.
- Verifier les domaines autorises Supabase Auth.
- Verifier les URLs de redirection OAuth dans Supabase.
- Verifier que Cloudinary et Resend sont configures en production.

## Resultat attendu

Le site peut etre considere pret quand:

- Les pages publiques s'ouvrent sans erreur.
- Un client peut creer un compte, se connecter et commander.
- WhatsApp et Cash fonctionnent comme moyens de commande.
- Wave et Orange Money restent clairement non disponibles.
- L'admin peut gerer produits, categories, commandes, bannieres et blog.
- Les uploads et emails fonctionnent en production.
- `npm run lint`, `npm run test:run` et `npm run build` passent.
