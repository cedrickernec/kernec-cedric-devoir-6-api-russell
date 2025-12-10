export const getDocumentation = (req, res) => {
    res.send(`
        <html>
        <head>
            <meta charset="UTF-8" />
            <title>Documentation de l'API Russell</title>

            <style>
                /* ===================== GLOBAL ====================== */
                body {
                    margin: 0;
                    padding: 0;
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    background: #f7f7f7;
                    overflow: hidden;
                }

                .layout {
                    display: flex;
                    min-height: 100vh;
                }

                * {
                 box-sizing: border-box;
                }

                /* ===================== SIDEBAR ====================== */
                .sidebar {
                    width: 260px;
                    height: 100vh;
                    background: #ffffff;
                    border-right: 1px solid #ddd;
                    padding: 30px 20px;
                    overflow-y: auto;
                    flex-shrink: 0;
                }

                h1 {
                    text-align: left;
                    margin-top: 0;
                    margin-bottom: 20px;
                    font-size: 22px;
                    font-weight: bold;
                }

                .menu-group {
                    margin-bottom: 16px;
                }

                .menu-title {
                    font-weight: bold;
                    cursor: pointer;
                    color: #0066cc;
                    margin: 8px 0;
                }

                .menu-title::before {
                    content: "▶ ";
                    font-size: 12px;
                }

                .menu-title.open::before {
                    content: "▼ ";
                }

                .menu-list {
                    max-height: 0;
                    overflow: hidden;
                    list-style: none;
                    margin: 0;
                    padding-left: 12px;
                    transition: max-height 0.3s ease;
                }

                .menu-list.open {
                    max-height: 500px;
                }

                .menu-list li {
                    margin: 4px 0;
                }

                .menu-list a {
                    text-decoration: none;
                    color: #333;
                    font-size: 14px;
                }

                .menu-list a:hover {
                    color: #0066cc;
                }

                /* ===================== MAIN CONTENT ====================== */
                .content {
                    flex: 1;
                    padding: 30px;
                    height: 100vh;
                    overflow-y: auto;
                }

                h2 {
                    margin-top: 40px;
                    color: #333;
                    font-size: 22px;
                    border-left: 4px solid #0066cc;
                    padding-left: 10px;
                    border-radius: 5px 0 0 5px;
                }

                h2:first-child {
                    margin-top: 0;
                }

                [id] {
                    scroll-margin-top: 80px;
                }

                .route-block {
                    background: white;
                    padding: 15px 20px;
                    border-radius: 6px;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                    margin-bottom: 20px;
                }

                .method {
                    font-weight: bold;
                    color: #0066cc;
                }

                code {
                    padding: 3px 6px;
                    border-radius: 4px;
                    font-size: 14px;
                }

                pre {
                    background: #272822;
                    color: #f8f8f2;
                    padding: 12px;
                    border-radius: 6px;
                    overflow-x: auto;
                    margin-top: 8px;
                }

                .example-title {
                    font-weight: bold;
                    margin-top: 10px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                details {
                    margin-top: 10px;
                }

                details summary {
                    cursor: pointer;
                    font-weight: 600;
                    color: #333;
                    list-style: none;
                    padding-bottom: 5px;
                }

                details summary::before {
                    content: "▶ ";
                    font-size: 12px;
                }

                details[open] summary::before {
                    content: "▼ ";
                }

                .error-type {
                    font-weight: bold;
                    font-size: 14px;
                    color: #333;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    margin: 12px 0;
                    border-left: 4px solid #ed6767ff;
                    padding-left: 10px;
                }

                /* ===================== BADGES HTTP ====================== */
                .badge {
                    display: inline-block;
                    padding: 2px 8px;
                    border-radius: 6px;
                    font-size: 11px;
                    font-weight: bold;
                    color: white;
                }
                .badge-success { background: #114b15ff; color: #67ed70ff }
                .badge-error   { background: #4b1111ff; color: #ed6767ff }
                .badge-500     { background: #820000ff; color: #ffa8a8ff }
            </style>
        </head>

        <body>
            <div class="layout">
                <aside class="sidebar">
                    <h1>Documentation<br>de l'API Russell</h1>

                    <nav class="sidebar-nav">

                        <div class="menu-group">
                            <p class="menu-title">Authentification</p>
                            <ul class="menu-list">
                                <li><a href="#signup">Créer un utilisateur</a></li>
                                <li><a href="#login">Se connecter</a></li>
                                <li><a href="#logout">Se déconnecter</a></li>
                            </ul>
                        </div>

                        <div class="menu-group">
                            <p class="menu-title">Utilisateurs</p>
                            <ul class="menu-list">
                                <li><a href="#users-list">Liste des utilisateurs</a></li>
                                <li><a href="#users-get">Détails d'un utilisateur</a></li>
                                <li><a href="#users-update">Modifier un utilisateur</a></li>
                                <li><a href="#users-password">Modifier mot de passe</a></li>
                                <li><a href="#users-delete">Supprimer un utilisateur</a></li>
                            </ul>
                        </div>

                        <div class="menu-group">
                            <p class="menu-title">Catways</p>
                            <ul class="menu-list">
                                <li><a href="#catways-list">Liste des catways</a></li>
                                <li><a href="#catways-get">Détails d'un catway</a></li>
                                <li><a href="#catways-create">Créer un catway</a></li>
                                <li><a href="#catways-update">Modifier un catway</a></li>
                                <li><a href="#catways-delete">Supprimer un catway</a></li>
                            </ul>
                        </div>

                        <div class="menu-group">
                            <p class="menu-title">Réservations</p>
                            <ul class="menu-list">
                                <li><a href="#reservations-list">Liste globale des réservations</a></li>
                                <li><a href="#reservations-catway">Liste des réservations par catway</a></li>
                                <li><a href="#reservations-get">Détails d'une réservation</a></li>
                                <li><a href="#reservations-create">Créer une réservation</a></li>
                                <li><a href="#reservations-update">Modifier une réservation</a></li>
                                <li><a href="#reservations-delete">Supprimer une réservation</a></li>
                            </ul>
                        </div>

                        <div class="menu-group">
                            <p class="menu-title">Erreurs globales</p>
                            <ul class="menu-list">
                                <li><a href="#errors">Types d’erreurs</a></li>
                            </ul>
                        </div>

                    </nav>
                </aside>

                <main class="content">     
                    <!-- ======================== AUTH =========================== -->

                    <h2 id="auth">Authentification</h2>

                    <div class="route-block">
                        <p id="signup"><span class="method">POST</span> <code>/auth/signup</code> – Créer un utilisateur</p>

                        <details>
                            <summary>Réponses valides</summary>

                            <p class="example-title">Exemple requête :</p>
                            <pre><code>{
    "username": "John",
    "email": "john@doe.com",
    "password": "Password123!"
}</code></pre>

                            <p class="example-title">
                                Réponse <span class="badge badge-success">201 Created</span>
                            :</p>
                            <pre><code>{
    "message": "Utilisateur créé avec succès.",
    "user": {
        "id": "...",
        "username": "john",
        "email": "john@doe.com"
    }
}</code></pre>
                        </details>

                        <details>
                            <summary>Erreurs courantes</summary>

                            <p class="example-title">
                                Erreur <span class="badge badge-error">400 Bad Request</span>
                            :</p>

                            <p class="error-type">Contrôle des champs obligatoires<p>
                            <pre><code>{
    "message": "Tous les champs sont obligatoires."
}</code></pre>

                            <p class="error-type">Contrôle de validation du nom d'utilisateur<p>
                            <pre><code>{
    "message": "Le nom d'utilisateur doit contenir entre 3 et 20 caractères (lettres, chiffres, - ou _)."
}</code></pre>

                            <p class="error-type">Contrôle de validation de l'email<p>
                            <pre><code>{
    "message": "Format d'email invalide (ex : nom@domaine.com)."
}</code></pre>

                            <p class="error-type">Contrôle de validation du mot de passe<p>
                            <pre><code>{
    "message": "Le mot de passe ne respecte pas les règles de sécurité.",
    "error": {
        "minLength": "8 caractères minimum requis",
        "uppercase": "1 lettre majuscule requise",
        "lowercase": "1 lettre minuscule requise",
        "number": "1 chiffre requis",
        "special": "1 caractère spécial requis"
    }
}</code></pre>
                        </details>
                    </div>

                    <div class="route-block">
                        <p id="login"><span class="method">POST</span> <code>/auth/login</code> – Se connecter</p>

                        <details>
                            <summary>Réponses valides</summary>

                            <p class="example-title">Exemple requête :</p>
                            <pre><code>{
    "email": "john@doe.com",
    "password": "Password123!"
}</code></pre>

                            <p class="example-title">
                                Réponse <span class="badge badge-success">200 OK</span>
                            :</p>
                            <pre><code>{
    "message": "Connexion réussie",
    "token": "xxxx.yyyy.zzzz"
    "user": {
        "id": "6938210540eed7411e9356d1",
        "username": "John",
        "email": "john@doe.com"
    }
}</code></pre>
                        </details>

                        <details>
                            <summary>Erreurs courantes</summary>
                            
                            <p class="example-title">
                                Erreur <span class="badge badge-error">400 Bad Request</span>
                            :</p>
                            <pre><code>{
    "message": "Email ou mot de passe incorrect."
}</code></pre>
                        </details>

                    </div>

                    <div class="route-block">
                        <p id="logout"><span class="method">GET</span> <code>/auth/logout</code> – Se déconnecter</p>

                        <details>
                            <summary>Réponses valides</summary>

                            <p class="example-title">
                                Réponse <span class="badge badge-success">200 OK</span>
                            :</p>

                            <pre><code>{
    "message": "Déconnecté avec succès."
}</code></pre>
                        </details>
                    </div>

                    <!-- ======================== USERS =========================== -->

                    <h2 id="users">Utilisateurs</h2>

                    <div class="route-block">
                        <p id="users-list"><span class="method">GET</span> <code>/api/users</code> – Liste des utilisateurs</p>

                        <details>
                            <summary>Réponses valides</summary>

                            <p class="example-title">
                                Réponse <span class="badge badge-success">200 OK</span>
                            :</p>

                            <pre><code>[
    {
        "id": "...",
        "username": "John",
        "email": "john@doe.com"
    }
    ...
]</code></pre>
                        </details>
                    </div>

                    <div class="route-block">
                        <p id="users-get"><span class="method">GET</span> <code>/api/users/:id</code> – Récupérer un utilisateur</p>

                        <details>
                            <summary>Réponses valides</summary>

                            <p class="example-title">
                                Réponse <span class="badge badge-success">200 OK</span>
                            :</p>

                            <pre><code>{
    "id": "...",
    "username": "John",
    "email": "john@doe.com"
}</code></pre>
                        </details>
                    </div>

                    <div class="route-block">
                        <p id="users-update"><span class="method">PUT</span> <code>/api/users/:id</code> – Modifier username / email</p>

                        <details>
                            <summary>Réponses valides</summary>

                            <p class="example-title">Exemple requête :</p>
                            <pre><code>{
    "username": "Johnatan"
}</code></pre>

                            <p class="example-title">
                                Réponse <span class="badge badge-success">200 OK</span>
                            :</p>

                            <pre><code>{
    "message": "Utilisateur mis à jour.",
    "user": {
        "id": "...",
        "username": "Johnatan",
        "email": "john@doe.com"
    }
}</code></pre>
                        </details>

                        <details>
                            <summary>Erreurs courantes</summary>
                            
                            <p class="example-title">
                                Erreur <span class="badge badge-error">400 Bad Request</span>
                            :</p>

                            <p class="error-type">Contrôle de validation du nouveau nom d'utilisateur<p>
                            <pre><code>{
    "message": "Données invalides",
    "errors": {
        "username": "Le nom d'utilisateur doit contenir entre 3 et 20 caractères (lettres, chiffres, - ou _)."
    }
}</code></pre>

                            <p class="error-type">Contrôle de validation du nouvel email<p>
                            <pre><code>{
    "message": "Données invalides",
    "errors": {
        "email": "Format d'email invalide (ex : nom@domaine.com)."
    }
}</code></pre>

                            <p class="error-type">Modification du mot de passe<p>
                            <pre><code>{
    "message": "La modification du mot de passe doit se faire via la route dédiée."
}</code></pre>
                        </details>
                    </div>

                    <div class="route-block">
                        <p id="users-password"><span class="method">PUT</span> <code>/api/users/:id/password</code> – Modifier mot de passe</p>

                        <details>
                            <summary>Réponses valides</summary>

                            <p class="example-title">Exemple requête :</p>
                            <pre><code>{
    "newPassword": "Nouveau123!"
}</code></pre>

                            <p class="example-title">
                                Réponse <span class="badge badge-success">200 OK</span>
                            :</p>

                            <pre><code>{
    "message": "Nouveau mot de passe enregistré.",
}</code></pre>
                        </details>

                        <details>
                            <summary>Erreurs courantes</summary>
                            
                            <p class="example-title">
                                Erreur <span class="badge badge-error">400 Bad Request</span>
                            :</p>

                            <p class="error-type">Contrôle du champ obligatoire<p>
                            <pre><code>{
    "message": "Le nouveau mot de passe est requis."
}</code></pre>

                            <p class="error-type">Contrôle de validation du nouveau mot de passe<p>
                            <pre><code>{
    "message": "Mot de passe invalide.",
    "errors": {
        "minLength": "8 caractères minimum requis",
        "uppercase": "1 lettre majuscule requise",
        "lowercase": "1 lettre majuscule requise",
        "number": "1 chiffre requis",
        "special": "1 caractère spécial requis"
    }
}</code></pre>
                        </details>
                    </div>

                    <div class="route-block">
                        <p id="users-delete"><span class="method">DELETE</span> <code>/api/users/:id</code> – Supprimer un utilisateur</p>

                        <details>
                            <summary>Réponses valides</summary>

                            <p class="example-title">
                                Réponse <span class="badge badge-success">200 OK</span>
                            :</p>

                            <pre><code>{
    "message": "Utilisateur supprimé avec succès."
}</code></pre>
                        </details>
                    </div>

                    <!-- ======================== CATWAYS =========================== -->

                    <h2 id="catways">Catways</h2>

                    <div class="route-block">
                        <p id="catways-list"><span class="method">GET</span> <code>/api/catways</code> – Liste des catways</p>

                        <details>
                            <summary>Réponses valides</summary>

                            <p class="example-title">
                                Réponse <span class="badge badge-success">200 OK</span>
                            :</p>

                            <pre><code>[
    {
        "catwayNumber": 5,
        "catwayType": "long",
        "catwayState": "Bon état"
    }
    ...
]</code></pre>
                        </details>
                    </div>

                    <div class="route-block">
                        <p id="catways-get"><span class="method">GET</span> <code>/api/catways/:id</code> – Détails d'un catway</p>

                        <details>
                            <summary>Réponses valides</summary>

                            <p class="example-title">
                                Réponse <span class="badge badge-success">200 OK</span>
                            :</p>

                            <pre><code>{
    "id": "...",
    "catwayNumber": 9,
    "catwayType": "long",
    "catwayState": "Plusieurs grandes tâches de peinture bleue sur le ponton"
}</code></pre>
                        </details>

                        <details>
                            <summary>Erreurs courantes</summary>

                            <p class="example-title">
                                Erreur <span class="badge badge-error">404 Not Found</span>
                            :</p>

                            <p class="error-type">Contrôleur de validation de l'ID du catway<p>
                            <pre><code>{
    "message": "Catway introuvable."
}</code></pre>

                        </details>
                    </div>

                    <div class="route-block">
                        <p id="catways-create"><span class="method">POST</span> <code>/api/catways</code> – Créer un catway</p>

                        <details>
                            <summary>Réponses valides</summary>

                            <p class="example-title">Requête :</p>
                            <pre><code>{
        "catwayNumber": 25,
        "catwayType": "long",
        "catwayState": "Bon état"
}</code></pre>

                            <p class="example-title">
                                Réponse <span class="badge badge-success">201 Created</span>
                            :</p>
                            <pre><code>{
    "message": "Catway créé avec succès.",
    "catway": {
        "catwayNumber": 25,
        "catwayType": "long",
        "catwayState": "Bon état",
        "_id": "..."
    }
}</code></pre>
                        </details>

                        <details>
                            <summary>Erreurs courantes</summary>
                            
                            <p class="example-title">
                                Erreur <span class="badge badge-error">400 Bad Request</span>
                            :</p>

                            <p class="error-type">Contrôle des champs obligatoires<p>
                            <pre><code>{
    "message": "Données invalides",
    "errors": {
        "catwayNumber": "Champ obligatoire manquant : Numéro de catway",
        "catwayType": "Champ obligatoire manquant : Type de catway",
        "catwayState": "Champ obligatoire manquant ou invalide : État du catway"
    }
}</code></pre>

                            <p class="error-type">Contrôle de conflit entre deux catways<p>
                            <pre><code>{
    "message": "Un catway avec ce numéro existe déjà.",
    "existingCatway": {
        "_id": "...",
        "catwayNumber": 2,
        "catwayType": "short",
        "catwayState": "bon état",
    }
}</code></pre>
                        </details>
                    </div>

                    <div class="route-block">
                        <p id="catways-update"><span class="method">PUT</span> <code>/api/catways/:id</code> – Modifier un catway</p>

                        <details>
                            <summary>Réponses valides</summary>

                            <p class="example-title">Requête :</p>
                            <pre><code>{
        "catwayState": "En cours de réparation. Ne peut être réservé."
}</code></pre>

                            <p class="example-title">
                                Réponse <span class="badge badge-success">200 OK</span>
                            :</p>
                            <pre><code>{
    "message": "Catway mis à jour.",
    "catway": {
        "_id": "6938389622c45c33cffe5131",
        "catwayNumber": 25,
        "catwayType": "long",
        "catwayState": "En cours de réparation. Ne peut être réservé."
    }
}</code></pre>
                        </details>

                        <details>
                            <summary>Erreurs courantes</summary>
                            <p class="example-title">
                                Erreur <span class="badge badge-error">400 Bad Request</span>
                            :</p>

                            <p class="error-type">Contrôle des champs obligatoires<p>
                            <pre><code>{
    "message": "Données invalides",
    "errors": {
        "catwayNumber": "Champ obligatoire manquant : Numéro de catway",
        "catwayType": "Champ obligatoire manquant : Type de catway",
        "catwayState": "Champ obligatoire manquant ou invalide : État du catway"
    }
}</code></pre>

                            <p class="error-type">Contrôle de conflit entre deux catways<p>
                            <pre><code>{
    "message": "Un catway avec ce numéro existe déjà.",
    "existingCatway": {
        "_id": "...",
        "catwayNumber": 2,
        "catwayType": "short",
        "catwayState": "bon état",
    }
}</code></pre>

                            <p class="example-title">
                                Erreur <span class="badge badge-error">404 Not Found</span>
                            :</p>

                            <p class="error-type">Contrôleur de validation de l'ID du catway<p>
                            <pre><code>{
    "message": "Catway introuvable."
}</code></pre>
                        </details>
                    </div>

                    <div class="route-block">
                        <p id="catways-delete"><span class="method">DELETE</span> <code>/api/catways/:id</code> – Supprimer un catway</p>

                        <details>
                            <summary>Réponses valides</summary>

                            <p class="example-title">
                                Réponse <span class="badge badge-success">200 OK</span>
                            :</p>

                            <pre><code>{
    "message": "Catway supprimé avec succès."
}</code></pre>
                        </details>

                        <details>
                            <summary>Erreurs courantes</summary>
                            <p class="example-title">
                                Erreur <span class="badge badge-error">404 Not Found</span>
                            :</p>

                            <p class="error-type">Contrôleur de validation de l'ID du catway<p>
                            <pre><code>{
    "message": "Catway introuvable."
}</code></pre>
                        </details>
                    </div>

                    <!-- ======================== RÉSERVATIONS =========================== -->

                    <h2 id="reservations">Réservations</h2>

                    <div class="route-block">
                        <p id="reservations-list"><span class="method">GET</span> <code>/api/reservations</code> – Liste globale des réservations</p>

                        <details>
                            <summary>Réponses valides</summary>

                            <p class="example-title">
                                Réponse <span class="badge badge-success">200 OK</span>
                            :</p>

                            <pre><code>[
    {
       "_id": "...",
        "catwayNumber": 1,
        "clientName": "Thomas Martin",
        "boatName": "Carolina",
        "startDate": "2024-05-21T06:00:00.000Z",
        "endDate": "2024-10-27T06:00:00.000Z"
    }
    ...
]</code></pre>

                        </details>
                    </div>

                    <div class="route-block">
                        <p id="reservations-catway"><span class="method">GET</span> <code>/api/catways/:id/reservations</code> – Liste des réservations d’un catway</p>

                        <details>
                            <summary>Réponses valides</summary>

                            <p class="example-title">
                                Réponse <span class="badge badge-success">200 OK</span>
                            :</p>

                            <pre><code>[
    {
        "_id": "...",
        "catwayNumber": 2,
        "clientName": "John Doe",
        "boatName": "Groeland",
        "startDate": "2024-05-18T06:00:00.000Z",
        "endDate": "2024-11-30T06:00:00.000Z"
    }
]</code></pre>

                        </details>
                    </div>

                    <div class="route-block">
                        <p id="reservations-get"><span class="method">GET</span> <code>/api/catways/:id/reservations/:idReservation</code> – Voir une réservation</p>

                        <details>
                            <summary>Réponses valides</summary>

                            <p class="example-title">
                                Réponse <span class="badge badge-success">200 OK</span>
                            :</p>

                            <pre><code>{
    "_id": "...",
    "catwayNumber": 2,
    "clientName": "John Doe",
    "boatName": "Groeland",
    "startDate": "2024-05-18T06:00:00.000Z",
    "endDate": "2024-11-30T06:00:00.000Z"
}</code></pre>
                        </details>

                        <details>
                            <summary>Erreurs courantes</summary>
                            <p class="example-title">
                                Erreur <span class="badge badge-error">404 Not Found</span>
                            :</p>

                            <p class="error-type">Contrôleur de validation de l'ID de la réservation<p>
                            <pre><code>{
    "message": "Réservation introuvable."
}</code></pre>
                        </details>
                    </div>

                    <div class="route-block">
                        <p id="reservations-create"><span class="method">POST</span> <code>/api/catways/:id/reservations</code> – Créer une réservation</p>

                        <details>
                            <summary>Réponses valides</summary>

                            <p class="example-title">Requête :</p>
                            <pre><code>{
    "catwayNumber": 2,
    "clientName": "Jeanne Doe",
    "boatName": "Appolica",
    "startDate": "2025-01-18T06:00:00.000Z",
    "endDate": "2025-11-30T06:00:00.000Z"
}</code></pre>

                            <p class="example-title">
                                Réponse <span class="badge badge-success">201 Created</span>
                            :</p>
                            <pre><code>{
    "message": "Réservation créée avec succès.",
    "reservation": {
        "catwayNumber": 2,
        "clientName": "Jeanne Doe",
        "boatName": "Appolica",
        "startDate": "2025-01-18T06:00:00.000Z",
        "endDate": "2025-11-30T06:00:00.000Z",
        "_id": "..."
}</code></pre>
                        </details>

                        <details>
                            <summary>Erreurs courantes</summary>
                            <p class="example-title">
                                Erreur <span class="badge badge-error">400 Bad Request</span>
                            :</p>

                            <p class="error-type">Contrôle des champs obligatoires<p>
                            <pre><code>{
    "message": "Données invalides",
    "errors": {
        "clientName": "Champ obligatoire manquant : Nom du client",
        "boatName": "Champ obligatoire manquant : Nom du bateau",
        "startDate": "Champ obligatoire manquant : Date d'entrée",
        "endDate": "Champ obligatoire manquant : Date de sortie"
    }
}</code></pre>

                            <p class="error-type">Contrôle de validation de format des dates<p>
                            <pre><code>{
    "message": "Données invalides",
    "errors": {
        "startDate": "Format de la date d'entrée invalide.",
        "endDate": "Format de la date de sortie invalide."
    }
}</code></pre>

                            <p class="error-type">Contrôle de validation de réservabilité du catway (hors service ?)<p>
                            <pre><code>{
    "message": "Catway hors service.",
    "catwayState": "En cours de réparation. Ne peut être réservée actuellement"
    }
}</code></pre>

                            <p class="error-type">Contrôle de validation des dates de réservation<p>
                            <pre><code>{
    "message": "Données invalides",
    "errors": {
        "dateOrder": "La date d'entrée doit être antérieure à la date de sortie."
    }
}</code></pre>

                            <p class="example-title">
                                Erreur <span class="badge badge-error">404 Not Found</span>
                            :</p>

                            <p class="error-type">Contrôle de validation du catway existant<p>
                            <pre><code>{
    "message": "Catway inexistant.",
    "detail": "Aucun catway ne correspond au numéro 99."
}</code></pre>

                            <p class="example-title">
                                Erreur <span class="badge badge-error">409 Conflict</span>
                            :</p>

                            <p class="error-type">Contrôle de conflit avec une réservation existante<p>
                            <pre><code>{
    "message": "Ce catway est déjà réservé sur ce créneau.",
    "conflictWith": {
        "_id": "...",
        "catwayNumber": 2,
        "clientName": "John Doe",
        "boatName": "Groeland",
        "startDate": "2024-05-18T06:00:00.000Z",
        "endDate": "2024-11-30T06:00:00.000Z",
}</code></pre>
                        </details>
                    </div>

                    <div class="route-block">
                        <p id="reservations-update"><span class="method">PUT</span> <code>/api/catways/:id/reservations/:idReservation</code> – Modifier une réservation</p>

                        <details>
                            <summary>Réponses valides</summary>

                            <p class="example-title">Requête :</p>
                            <pre><code>{
    "startDate": "2025-02-18T06:00:00.000Z",
    "endDate": "2025-09-30T06:00:00.000Z"
}</code></pre>

                            <p class="example-title">
                                Réponse <span class="badge badge-success">200 OK</span>
                            :</p>
                            <pre><code>{
    "message": "Réservation mise à jour",
    "reservation": {
        "_id": "...",
        "catwayNumber": 2,
        "clientName": "Jeanne Doe",
        "boatName": "Appolica",
        "startDate": "2025-02-18T06:00:00.000Z",
        "endDate": "2025-09-30T06:00:00.000Z"
}</code></pre>
                        </details>

                        <details>
                            <summary>Erreurs courantes</summary>
                            <p class="example-title">
                                Erreur <span class="badge badge-error">400 Bad Request</span>
                            :</p>

                            <p class="error-type">Contrôle des champs obligatoires<p>
                            <pre><code>{
    "message": "Données invalides",
    "errors": {
        "clientName": "Champ obligatoire manquant : Nom du client",
        "boatName": "Champ obligatoire manquant : Nom du bateau",
        "startDate": "Champ obligatoire manquant : Date d'entrée",
        "endDate": "Champ obligatoire manquant : Date de sortie"
    }
}</code></pre>
            
                            <p class="example-title">
                                Erreur <span class="badge badge-error">404 Not Found</span>
                            :</p>

                            <p class="error-type">Contrôle de validation de la réservation existante<p>
                            <pre><code>{
    "message": "Réservation introuvable."
    }
}</code></pre>
                        </details>

                    </div>

                    <div class="route-block">
                        <p id="reservations-delete"><span class="method">DELETE</span> <code>/api/catways/:id/reservations/:idReservation</code> – Supprimer une réservation</p>

                        <details>
                            <summary>Réponses valides</summary>

                            <p class="example-title">
                                Réponse <span class="badge badge-success">200 OK</span>
                            :</p>

                            <pre><code>{
    "message": "Réservation supprimée avec succès."
}</code></pre>
                        </details>

                        <details>
                            <summary>Erreurs courantes</summary>               
                            <p class="example-title">
                                Erreur <span class="badge badge-error">404 Not Found</span>
                            :</p>

                            <p class="error-type">Contrôle de validation de la réservation existante<p>
                            <pre><code>{
    "message": "Réservation introuvable."
}</code></pre>
                        </details>
                    </div>

                    <h2 id="errors">Erreurs globales de l'API</h2>

                    <div class="route-block">
                    
                            <p class="example-title">
                                Erreur <span class="badge badge-error">401 Unauthorized</span>
                            :</p>

                            <p class="error-type">Token invalide, manquant ou expiré<p>
                            <pre><code>{
    "message": "Accès refusé: aucun token fourni."
}</code></pre>

                            <p class="example-title">
                                Erreur <span class="badge badge-error">500 Internal Serveur Error</span>
                            :</p>

                            <p class="error-type">Erreur interne serveur<p>
                            <pre><code>{
    "message": "Erreur serveur",
    "error": "..."
}</code></pre>
                    </div>

                    <script>
                    document.addEventListener("DOMContentLoaded", () => {
                        const titles = document.querySelectorAll(".menu-title");

                        titles.forEach(title => {
                            title.addEventListener("click", () => {
                                
                                // Ferme tous les groupes sauf celui cliqué
                                titles.forEach(t => {
                                    if (t !== title) {
                                        t.classList.remove("open");
                                        t.nextElementSibling.classList.remove("open");
                                    }
                                });

                                // Ouvre/ferme celui cliqué
                                title.classList.toggle("open");
                                title.nextElementSibling.classList.toggle("open");
                            });
                        });
                    });
                    </script>
                </main>
            </div>
        </body>
        </html>
    `);
};