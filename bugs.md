# Bugs | 6/19/25

## Desktop

* Possibilité de ne pas avoir de workspace (section originel qui peut se faire supprimée)
* Pas d'animation d'entrée sur le views menu OK
* Bouton sign out dans le "account" menu il est bizarre (light mode) OK
* Pas sûr qu'on puisse delete un account OK
* On peut pas changer de pseudos le go premium ? : Etat : avancé
* Lorsqu'on veut edit une section depuis le add menu : bug
* Lorsqu'on se login on a une unexpected error (fix avec gemini) : OK

## Mobile

* "Profile" (paramètres) DEGUELASSES
* Problème de dropdown et d'espacement sur le dropdown des sections d'une nouvelle tache (add menu)

# Error sur un ajout de tag (mobile)

TypeError: Cannot read properties of undefined (reading 'slice')

## Source

context\ErrorContext.js (134:51) @ slice

```
 132 |// Non-Axios error
 133 |       errorInfo = {
> 134 |         title:`Unexpected Error: ${error.message.slice(0, 50)}${
     |^
 135 |          error.message.length > 50 ? "..." : ""
 136 |        }`,
 137 |         subtitle:
```

## Call Stack

# Autres erreurs

Pas de changement de langue/fuseaux horaires + 24h date format

## Page d'accueil :

* Lorsqu'on switch monthly/annual : on a un changement de height abrupte et déguelasse
* Sign up card et login card déguelasse (pas responsive)
* "I have read [...] of use." : quand on clique dessus, ça coche pas
* A QUOI SERT LE USERNAME
