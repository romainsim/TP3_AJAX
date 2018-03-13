window.addEventListener("load",function(){
	document // on ajoute au bouton submit un évenement
		.getElementById("form")
		.addEventListener(
			"submit",
			function(ev){
				ev.preventDefault(); // on enlève l'action par défaut du submit
				var message = {"message":this.message.value}; // on récupère la valeur de l'input
				var ajax=new XMLHttpRequest(); // on crée une connexion avec un serveur
				var t=Date.now(); // on récupère la date actuelle
				var that=this; // on récupère le formulaire
				ajax.open("POST","./php/serveur.php"); // on ouvre la connexion avec le serveur PHP
				ajax.setRequestHeader("Content-type", "application/json"); // on spécifie le type , dans notre cas c'est du JSON
				ajax.send(JSON.stringify(message)); // on transforme notre objet au format JSON et on l'envoie au serveur
				document.getElementById('spinner').style.visibility = "visible"; // on rend visible l'effet de chargement
				ajax.onreadystatechange=function(){ //IMPORTANT: il s'agit de la fonction principale , la fonction est appelé à chaque changement d'état de la requête
				// pour voir quels sont les différents états il faut se référer à la doc mais l'état le plus intéréssant est l'état DONE c'est à dire l'état ou la requête est terminée
					if (
						this.readyState == this.DONE
							&&	this.status == 200
					){ //Si la requête est terminée et que la réponse du serveur est positive (code 200)
						var li = document.createElement("li"); //on crée un élément virtuel li
						var ul = document.getElementById("listeMessages"); // on récupère la liste des messages , il s'agit d'un ul dans le document HTML
						ul.insertBefore(li,ul.firstChild); // on insère le li dans le ul juste avant le premier li du ul (en gros le met en premier dans la liste)
						li.innerHTML=message.message
							+ " <span class='tag-box -success'>"
							+(Date.now()-t)+" ms</span>"; // le li aura le conenu html suivant : la réponse du serveur responseText qui est sous format JSON et que l'on met en String pour mieux le lire (fonction JSON.parse)
							//ainsi que divers élément de style comme le temps
						document.getElementById('spinner').style.visibility = "hidden"; // on cache l'effet du chargement
						that.reset(); // on reinitialise le formulaire (la zone de texte)
					}
				}
			})
})