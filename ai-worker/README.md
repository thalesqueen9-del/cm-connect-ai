# Chatbot IA — CM Connect AI

L'interface du chatbot est déjà intégrée au site GitHub Pages. Ce dossier contient le serveur qui permet d'avoir une véritable IA conversationnelle, au lieu de réponses prédéfinies.

## À faire pour l'activer
1. Sur [Cloudflare](https://dash.cloudflare.com/), créer un compte et un Worker intitulé **cm-connect-ia-chat**.
2. Déployer le fichier `worker.js` depuis l'éditeur Cloudflare ou Wrangler.
3. Dans **Settings → Variables and Secrets** du Worker, créer un **Secret** nommé `OPENAI_API_KEY` et coller la clé créée dans le tableau de bord API OpenAI. Ne jamais mettre la clé dans GitHub ou le HTML.
4. Ajouter la variable `ALLOWED_ORIGIN` avec la valeur `https://thalesqueen9-del.github.io`.
5. Copier l'adresse HTTPS réelle du Worker, par exemple `https://cm-connect-ia-chat.XXX.workers.dev`.
6. Dans `index.html` à la racine, remplacer `window.CM_CONNECT_AI_API_URL = '';` par `window.CM_CONNECT_AI_API_URL = 'https://VOTRE-URL-WORKER';`.
7. Tester le chatbot sur le site public : https://thalesqueen9-del.github.io/cm-connect-ai/

## Notes importantes
- L'API OpenAI peut entraîner des frais. Utiliser un budget plafonné, une limitation du trafic et les protections anti-abus Cloudflare.
- Les messages sont envoyés au fournisseur d'IA pour recevoir une réponse ; prévoir une mention de confidentialité et éviter de demander des données sensibles.
- Aucune transmission automatique vers WhatsApp n'est implémentée.
- Si aucun Worker n'est connecté, le chatbot indique **mode démonstration** et utilise seulement quelques réponses locales.
