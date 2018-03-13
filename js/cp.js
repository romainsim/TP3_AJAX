window.onload = () => {
  var loupe = document.getElementById("chercher"); /*Lorsqu'on appuie sur la petite loupe*/
  loupe.addEventListener("click",(ev) => {
    ev.preventDefault(); /*On enleve l'action par défaut*/
    var valuechamp = document.getElementById("codep"); /*On récupère la valeur du code postal entré*/
    var cpvalue = encodeURIComponent(valuechamp.value); /* on l'encode en URI (pas nécéssaire)*/
    var params = "cp="+cpvalue; /*puis on le formate pour le serveur*/
    var promesse = new Promise( (resolve,reject) => { /* on crée une promesse*/
      var xhr = new XMLHttpRequest();
      xhr.open("POST","./Serveur/serveur.php");
      xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded"); //on spécife le header, qui doit être identique dans le serveur
      xhr.onload = function() { //à la fin du chargement de la réponse du serveur, dnas la fonction onload on spécifie ce qu'il se passe une fois qu'on a reçu une réponse du serveur
        if(xhr.status == 200 && xhr.responseText != "not exists") { // on vérfie que le serveur à bien répondu code 200 et on regarde si il nous a renvoyé "not exists" ou pas (selon le message d'erreur du serveur)
          resolve(xhr.responseText); //on invoque alors la méthode resolve avec la réponse du serveur
        }else {
          reject(xhr.responseText); // ou on invoque la méthode reject en cas d'erreur
        }
      }
      xhr.onerror = function() { // correspond à une erreur de réseau la plupart du temps
        reject("Erreur reseau pouloulou");
      }
      xhr.send(params); //on envoie les paramètres au serveur , dans notre cas , le code postal
    });
    promesse.then( // On demarre la promesse
      function(valeuretour) { /* FONCTION RESOLVE*/
        var errorcss = document.getElementById("nt"); /* on enleve la box qui dit qu'il y a une erreur*/
        errorcss.style.display = "none";
        /*FICHIER JSON*/
        var decodevaleuretour = JSON.parse(valeuretour); //on decode le JSON en le transformant en tableau
        var champs = [];
        console.log(decodevaleuretour); // utile pour bien comprendre le JSON est formaté et comment le javascript passe du JSON en array
        champs[0] = decodevaleuretour["codep"].ville; // on extrait la ville du json
        champs[1] = decodevaleuretour["codep"].departement; // on extrait le Département
        var select = document.getElementById("villes"); // on recupère le select
        var option = document.createElement("option"); // on créer une option
        option.textContent = champs[0]; // on lui donne le nom de la ville
        select.appendChild(option); // on rajoute l'option au select
        var departement = document.getElementById("departement"); // on récupère la zone du texte du département
        departement.value = champs[1]; // on lui donne la valeur du departement
      },
      function(erreurRetour) { /*FONCTION REJECT*/
        var errorcss = document.getElementById("nt"); // on affiche la box relative aux erreurs
        errorcss.style.display = "inline-block";
      }
    )
  },true);
};